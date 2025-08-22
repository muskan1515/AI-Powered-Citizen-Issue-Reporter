from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")

def classify_sentiment(text: str):
    """Classify sentiment and return in {label, confidence} format"""
    result = sentiment_pipeline(text)[0]  
    
    return {
        "label": result["label"],             
        "confidence": float(result["score"])  
    }
