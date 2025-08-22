from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import asyncio
from predictionFlow.issue_classification_prediction import classify_issue
from predictionFlow.sentiment_analysis_prediction import classify_sentiment
from predictionFlow.ner_prediction import predict_ner

app = FastAPI(title="AI Service Model")

class TextInput(BaseModel):
    text: str

def calculate_urgency(sentiment: dict, issue: dict) -> dict:
    """
    Calculate urgency dynamically using sentiment + issue classification.
    Returns both a score (0–1) and label (low/medium/high).
    """
    sentiment_label = sentiment["label"].lower()
    sentiment_conf = sentiment["confidence"]

    issue_label = issue["label"].lower()
    issue_conf = issue["confidence"]

    # Base urgency on sentiment
    if sentiment_label == "negative":
        base_score = 0.8 * sentiment_conf
    elif sentiment_label == "neutral":
        base_score = 0.5 * sentiment_conf
    else:  # positive
        base_score = 0.3 * sentiment_conf

    # Adjust urgency for specific issue types (examples)
    if "pothole" in issue_label or "accident" in issue_label:
        base_score += 0.3 * issue_conf
    elif "water leakage" in issue_label or "electricity" in issue_label:
        base_score += 0.2 * issue_conf
    elif "garbage" in issue_label or "streetlight" in issue_label:
        base_score += 0.1 * issue_conf

    urgency_score = min(1.0, round(base_score, 2))

    if urgency_score >= 0.75:
        urgency_label = "high"
    elif urgency_score >= 0.4:
        urgency_label = "medium"
    else:
        urgency_label = "low"

    return {"score": urgency_score, "label": urgency_label}



@app.post("/predict")
async def predict(input_text: TextInput):
    
    to_be_predicted_text = input_text.text
 
    # Run predictions in parallel
    sentiment_response, issue_classification_response, ner_response = await asyncio.gather(
        asyncio.to_thread(classify_sentiment, to_be_predicted_text),
        asyncio.to_thread(classify_issue, to_be_predicted_text),
        asyncio.to_thread(predict_ner, to_be_predicted_text),
    )

    urgency = calculate_urgency(sentiment_response, issue_classification_response)['label']

    return {
        "sentiment": sentiment_response,
        "issue" : issue_classification_response,
        "ner": ner_response,
        "urgency": urgency
    }