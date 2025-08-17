import os
import json
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping

# -------------- Config --------------
DATA_PATH = "/content/sample_data/datasets/ner.csv"   # path produced earlier
EXPORT_DIR = "/content/ner_model"               # where to save model and maps
VOCAB_SIZE = 20000                              # max tokens for TextVectorization
MAX_LEN = 100                                   # sequence length (cap/truncate)
EMBED_DIM = 128
BATCH_SIZE = 64
EPOCHS = 8
# -------------------------------------

# 1) Load CSV (expects columns: 'tokens', 'tags' where tokens/tags are space-joined strings)
df = pd.read_csv(DATA_PATH)
print("Rows:", len(df))
# quick sanity preview

print(df.head(3).to_dict(orient="records"))

# 2) Prepare token strings and tag lists
sentences = df["tokens"].astype(str).tolist()    # each is "token1 token2 ..."
tag_strs   = df["tags"].astype(str).tolist()     # each is "B-PER O O B-LOC ..."

# convert to list-of-lists
tokens_list = [s.split() for s in sentences]
tags_list   = [t.split() for t in tag_strs]

# 3) Build tag vocabulary with PAD=0
all_tags = sorted({tag for tags in tags_list for tag in tags})
# ensure 'PAD' reserved as 0
tag2idx = {"PAD": 0}
idx = 1

##if used the tokenizer then would loss somewhere the context due to padding token 
for tg in all_tags:
    if tg not in tag2idx:
        tag2idx[tg] = idx
        idx += 1
idx2tag = {i: t for t, i in tag2idx.items()}
num_tags = len(tag2idx)
print("Num tag types (including PAD):", num_tags)
print("Tag mapping (sample):", list(tag2idx.items())[:12])

# 4) Convert tags to integer sequences and pad to MAX_LEN (padding value = 0 for PAD)
y_seq = [[tag2idx[tag] for tag in tags] for tags in tags_list]
y_padded = pad_sequences(y_seq, maxlen=MAX_LEN, padding="post", truncating="post", value=0)  # shape (N, MAX_LEN)

# 5) We will use TextVectorization to convert whitespace tokens->ints (keeps tokens like emails)
vectorizer = layers.TextVectorization(
    max_tokens=VOCAB_SIZE,
    output_mode="int",
    output_sequence_length=MAX_LEN,
    standardize=None,   # keep punctuation & special tokens intact
    split="whitespace"
)
# adapt on the raw sentence strings
vectorizer.adapt(sentences)


# 6) Prepare inputs (strings) and sample weights mask (mask padded positions: 1 for real token, 0 for PAD)
X = np.array(sentences)             # shape (N,), strings
y = np.array(y_padded)              # shape (N, MAX_LEN), ints
sample_weight = (y != 0).astype("float32")  ## for every element in the y metric its gives false of 0 pad tokens we started idx from 1

# 7) Train/validation split (use stratify by presence of certain tags is tricky for seq; simple split)
from sklearn.model_selection import train_test_split
X_train, X_val, y_train, y_val, sw_train, sw_val = train_test_split(
    X, y, sample_weight, test_size=0.1, random_state=42
)

print("Train size:", len(X_train), "Val size:", len(X_val))

# 8) Build tf.data datasets (we'll pass sample_weight via dataset)
train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train, sw_train))
train_ds = train_ds.shuffle(10000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
val_ds   = tf.data.Dataset.from_tensor_slices((X_val, y_val, sw_val)).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# 9) Build model: TextVectorization (inside model) -> Embedding -> BiLSTM -> TimeDistributed Dense softmax
model = models.Sequential([
    vectorizer,   # accepts raw string inputs, outputs int token ids padded to MAX_LEN
    layers.Embedding(input_dim=VOCAB_SIZE, output_dim=EMBED_DIM, mask_zero=True),
    layers.Bidirectional(layers.LSTM(128, return_sequences=True, dropout=0.3, recurrent_dropout=0.2)),
    layers.TimeDistributed(layers.Dense(num_tags, activation="softmax"))
])

model.summary()

# 10) Compile
loss = "sparse_categorical_crossentropy"   # labels are integers (shape: (batch, seq_len))
optimizer = tf.keras.optimizers.Adam(learning_rate=1e-4)
model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])

# 11) Train (we pass dataset yielding (x, y, sample_weight) so Keras will use sample_weight)
callbacks = [EarlyStopping(monitor="val_loss", patience=2, restore_best_weights=True)]
history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, callbacks=callbacks)

# 12) Evaluate
val_loss, val_acc = model.evaluate(val_ds)
print("Validation loss:", val_loss, "Validation accuracy (token-level):", val_acc)

# 13) Save model (SavedModel format) and tag map
model.save("ner_model.keras")

with open(os.path.join(EXPORT_DIR, "tag_map.pkl"), "wb") as f:
    pickle.dump({"tag2idx": tag2idx, "idx2tag": idx2tag}, f)

# Save training history for diagnostics
with open(os.path.join(EXPORT_DIR, "training_history.json"), "w") as f:
    json.dump(history.history, f)

print("Saved model and tag_map to:", EXPORT_DIR)

# 14) Quick inference helper (map predictions back to tags)
def predict_ner(texts, model=model, idx2tag=idx2tag, max_len=MAX_LEN):
    """
    texts: list of raw sentences (whitespace tokenized)
    returns: list of lists of (token, predicted_tag)
    """
    if isinstance(texts, str):
        texts = [texts]
    # predict -> shape (batch, MAX_LEN, num_tags)
    probs = model.predict(np.array(texts), verbose=0)
    pred_idxs = np.argmax(probs, axis=-1)  # (batch, MAX_LEN)
    out = []
    for i, t in enumerate(texts):
        toks = t.split()
        toks = toks[:max_len]  # if longer, truncated
        tags = [idx2tag.get(int(idx), "PAD") for idx in pred_idxs[i][:len(toks)]]
        out.append(list(zip(toks, tags)))
    return out

# 15) Example prediction
example = "Please schedule a meeting with Alice Johnson in New York on 2024-05-12 contact alice.johnson@example.com"
print("Example:", example)
print("Predicted entities:", predict_ner(example))

# 16) Done
