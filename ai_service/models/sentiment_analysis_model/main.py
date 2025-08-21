import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel
import pickle

# Load model
model = tf.keras.models.load_model('sentiment_analysis_model.keras')

# Load label encoder (if needed)
with open('label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

# FastAPI setup
app = FastAPI(title="Sentiment Analysis Model")

class TextInput(BaseModel):
    text: str

@app.post("/predict")
def predict_sentiment(input_text: TextInput):
    # Convert to tensor dataset for TextVectorization
    tensor_text = tf.data.Dataset.from_tensor_slices([input_text.text]).batch(1)
    prediction = model.predict(tensor_text, verbose=0)

    # Convert prediction to label
    predicted_sentiment = "Positive" if prediction[0][0] > 0.5 else "Negative"

    return {
        "label": predicted_sentiment,
        "confidence": float(prediction[0][0])
    }
