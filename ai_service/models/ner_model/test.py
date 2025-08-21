import os
import re
import pickle
import numpy as np
import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences

# ---------------- Config ----------------
MAX_LEN = 200  # same as training
MODEL_PATH = "hf://muskankushwah15/ner_model"
TOKENIZER_PATH = "tokenizer.pkl"       # ensure you have tokenizer saved locally
TAG_MAP_PATH = "tag_map.pkl"           # tag2idx / idx2tag

# ---------------- Load model ----------------
os.environ["KERAS_BACKEND"] = "jax"
model = keras.saving.load_model(MODEL_PATH)

# Load tag mapping
with open('tag_map.pkl', 'rb') as f:
    tag_map = pickle.load(f)

tag2idx = tag_map["tag2idx"]
idx2tag = tag_map["idx2tag"]

def predict_ner(input):
    text = [input.text] if isinstance(input.text, str) else input.text

    # Predict
    predicted_response = model.predict(np.array(text), verbose=0)
    pred_idxs = np.argmax(predicted_response, axis=-1)

    output = []
    for i, t in enumerate(text):
        tokens = t.split()[:100]
        tags = [idx2tag.get(int(idx), "PAD") for idx in pred_idxs[i][:len(tokens)]]
        output.append({"token": tokens, "tag": tags})

    return output

if __name__ == "__main__":
    test_sentence = "John lives in New York City."
    prediction = predict_ner(test_sentence)
    print(prediction)