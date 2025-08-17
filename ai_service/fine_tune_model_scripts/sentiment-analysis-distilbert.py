# =========================
# 🔹 Install required packages
# =========================
!pip install --upgrade transformers peft datasets scikit-learn
# !pip install --upgrade bitsandbytes

# =========================
# 🔹 Imports
# =========================
import numpy as np
import pandas as pd
import re
import random
import torch
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    get_linear_schedule_with_warmup,
    # BitsBitsAndBytesConfig
)
from torch.optim import AdamW
from torch.utils.data import TensorDataset, DataLoader
from torch.nn.utils import clip_grad_norm_
from sklearn.metrics import accuracy_score, classification_report
from peft import LoraConfig, get_peft_model

# =========================
# 🔹 Seed & device
# =========================
def set_seed(s=42):
    random.seed(s)
    np.random.seed(s)
    torch.manual_seed(s)
    torch.cuda.manual_seed_all(s)
set_seed(42)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# 🔹 Config
# =========================
CFG = {
    "csv_path": "/content/sample_data/sentiment_analysis/sentiment_dataset.csv",
    "text_col": "review",
    "label_col": "sentiment",
    "model_name": "distilbert-base-uncased",
    "max_len": 128,
    "batch_size": 8,
    "lr": 2e-4,  # slightly higher for LoRA
    "weight_decay": 0.01,
    "epochs": 10,
    "patience": 2,
    "grad_clip": 1.0,
    "out_dir": "./distilbert_lora_cls",
    "max_rows": 10000
}
os.makedirs(CFG['out_dir'], exist_ok=True)

# =========================
# 🔹 Load dataset
# =========================
df = pd.read_csv(CFG['csv_path'])
text_col = CFG['text_col']
label_col = CFG['label_col']

# Clean text
def clean_text(text):
    text = re.sub(r'\s+', ' ', str(text))
    text = text.lower()
    return text.strip()
df[text_col] = df[text_col].apply(clean_text)
df.dropna(subset=[text_col], inplace=True)
df.drop_duplicates(subset=[text_col], inplace=True)

# Limit rows to max_rows
max_rows = 15000
if len(df) > CFG["max_rows"]:
    df = df.sample(n=CFG["max_rows"], random_state=42).reset_index(drop=True)

# Label encode
le = LabelEncoder()
df['label_id'] = le.fit_transform(df[label_col])
num_labels = len(le.classes_)

# Train/val split
train_df, val_df = train_test_split(
    df, test_size=0.2, random_state=42, stratify=df[label_col]
)

# =========================
# 🔹 Tokenizer
# =========================
tokenizer = AutoTokenizer.from_pretrained(CFG['model_name'])

def encode(texts):
    return tokenizer(
        list(texts),
        padding="max_length",
        truncation=True,
        max_length=CFG['max_len'],
        return_tensors="pt"
    )

train_enc = encode(train_df[text_col])
val_enc = encode(val_df[text_col])

train_y = torch.tensor(train_df['label_id'].values, dtype=torch.long)
val_y = torch.tensor(val_df['label_id'].values, dtype=torch.long)

train_ds = TensorDataset(train_enc['input_ids'], train_enc['attention_mask'], train_y)
val_ds = TensorDataset(val_enc['input_ids'], val_enc['attention_mask'], val_y)

train_loader = DataLoader(train_ds, batch_size=CFG['batch_size'], shuffle=True)
val_loader = DataLoader(val_ds, batch_size=CFG['batch_size'], shuffle=False)

# =========================
# 🔹 Model + LoRA
# =========================

###BitsAndBytesConfig
# bnb_config = BitsAndBytesConfig(
#     load_in_4bit=True,          # enable 4-bit quantization
#     bnb_4bit_compute_dtype=torch.float16,  # compute in fp16
#     bnb_4bit_use_double_quant=True,        # optional: reduces quantization error
#     bnb_4bit_quant_type="nf4"              # normal float 4 quantization
# )

model = AutoModelForSequenceClassification.from_pretrained(
    CFG['model_name'],
    num_labels=num_labels,
    # quantization_config=bnb_config,       
    # device_map="auto"            
)

for name, module in model.named_modules():
    print(name, type(module))

# LoRA config
lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules = ["q_lin", "v_lin"],
    lora_dropout=0.1,
    bias="none",
    task_type="SEQ_CLS"
)

model = get_peft_model(model, lora_config)
model.to(device)

# Freeze base model parameters except LoRA
for name, param in model.named_parameters():
    if "lora" not in name:
        param.requires_grad = False

# Optimizer & scheduler
optimizer = AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=CFG['lr'], weight_decay=CFG['weight_decay'])
total_steps = len(train_loader) * CFG['epochs']
warmup_steps = int(total_steps * 0.1)
scheduler = get_linear_schedule_with_warmup(optimizer, warmup_steps, total_steps)

# =========================
# 🔹 Training & Evaluation
# =========================
def train_one_epoch():
    model.train()
    total_loss, all_preds, all_labels = 0.0, [], []
    for input_ids, attn_mask, labels in train_loader:
        input_ids, attn_mask, labels = input_ids.to(device), attn_mask.to(device), labels.to(device)
        optimizer.zero_grad()
        out = model(input_ids=input_ids, attention_mask=attn_mask, labels=labels)
        loss, logits = out.loss, out.logits
        loss.backward()
        clip_grad_norm_(model.parameters(), CFG["grad_clip"])
        optimizer.step()
        scheduler.step()
        total_loss += loss.item()
        all_preds.append(torch.argmax(logits, dim=1).detach().cpu().numpy())
        all_labels.append(labels.detach().cpu().numpy())
    all_preds = np.concatenate(all_preds)
    all_labels = np.concatenate(all_labels)
    acc = accuracy_score(all_labels, all_preds)
    return total_loss / len(train_loader), acc

@torch.no_grad()
def eval_one_epoch():
    model.eval()
    total_loss, all_preds, all_labels = 0.0, [], []
    for input_ids, attn_mask, labels in val_loader:
        input_ids, attn_mask, labels = input_ids.to(device), attn_mask.to(device), labels.to(device)
        out = model(input_ids=input_ids, attention_mask=attn_mask, labels=labels)
        total_loss += out.loss.item()
        all_preds.append(torch.argmax(out.logits, dim=1).cpu().numpy())
        all_labels.append(labels.cpu().numpy())
    all_preds = np.concatenate(all_preds)
    all_labels = np.concatenate(all_labels)
    acc = accuracy_score(all_labels, all_preds)
    return total_loss / len(val_loader), acc, (all_labels, all_preds)

# Training loop with early stopping
best_val_acc, epochs_no_improve = 0.0, 0
best_path = os.path.join(CFG["out_dir"], "best_model.pt")

for epoch in range(1, CFG["epochs"] + 1):
    tr_loss, tr_acc = train_one_epoch()
    va_loss, va_acc, _ = eval_one_epoch()
    print(f"Epoch {epoch}/{CFG['epochs']} | "
          f"Train Loss {tr_loss:.4f} Acc {tr_acc:.4f}  ||  "
          f"Val Loss {va_loss:.4f} Acc {va_acc:.4f}")

    if va_acc > best_val_acc:
        best_val_acc = va_acc
        epochs_no_improve = 0
        torch.save(model.state_dict(), best_path)
    else:
        epochs_no_improve += 1
        if epochs_no_improve >= CFG["patience"]:
            print("⏹️ Early stopping (no val acc improvement).")
            break

# Load best model
model.load_state_dict(torch.load(best_path))
model.eval()

val_loss, val_acc, (y_true, y_pred) = eval_one_epoch()
print(f"\n🏁 Final Validation Accuracy: {val_acc:.4f}")
print("\nClassification Report:\n", classification_report(y_true, y_pred, target_names=le.classes_))

# Save tokenizer & model
model.config.id2label = {i: label for i, label in enumerate(le.classes_)}
model.config.label2id = {label: i for i, label in enumerate(le.classes_)}
tokenizer.save_pretrained(CFG["out_dir"])
model.save_pretrained(CFG["out_dir"])
print(f"✅ Model and tokenizer saved to {CFG['out_dir']}")


# =========================
# 🔹 Upload to Hugging Face Hub
# =========================
# 1. First, login once per machine/session:
from huggingface_hub import login
HF_TOKEN = input("Paste your Hugging Face token here: ")
login(token=HF_TOKEN)

# 2. Upload folder as model repo
from huggingface_hub import upload_folder
upload_folder(
    folder_path=CFG["out_dir"],
    repo_id="muskankushwah15/sentiment-analyzer-distilbert",
    commit_message="Initial upload of fine-tuned DistilBERT for issue classification"
)

