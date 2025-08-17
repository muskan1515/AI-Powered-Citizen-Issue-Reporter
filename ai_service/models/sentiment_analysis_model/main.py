import tensorflow as tf
import numpy as np
import fastapi as FastAPI
from pydantic import BaseModel
import pickle

##load model
model = tf.keras.models.load_model('sentiment_analysis_model.keras')

with open('label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)


# ----------------------------
# FastAPI setup
# ----------------------------
app = FastAPI(title="Sentiment Analysis Model")

class TextInput(BaseModel):
    text: str

@app.post("/predict")
def predict_sentiment(text: TextInput):
   ## as model only accept the tensor data for textVectorization
   tensor_text = tf.data.Dataset.from_tensor_slices([text]).batch(1)
   prediction = model.predict(tensor_text)
   
   predicted_sentiement = ("Positive" if prediction[0][0] > 0.5 else "Negative")

   return {"predicted_sentiment": predicted_sentiement}