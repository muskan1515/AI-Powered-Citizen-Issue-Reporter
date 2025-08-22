from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

CANDIDATE_LABELS = [
    # Infrastructure
    "pothole",
    "broken streetlight",
    "damaged road",
    "water leakage",
    "overflowing garbage",
    "sewage issue",
    "construction hazard",
    "traffic signal not working",
    "illegal parking",
    "blocked drain",
    
    # Utilities
    "electricity outage",
    "water shortage",
    "gas leakage",
    "telephone line down",
    "internet outage",

    # Environmental
    "air pollution",
    "noise pollution",
    "tree fallen",
    "animal nuisance",
    "mosquito breeding",

    # Safety
    "fire hazard",
    "accident spot",
    "unsafe building",
    "broken bridge",
    "open manhole",

    # Public services
    "public transport issue",
    "healthcare issue",
    "education issue",
    "government office complaint",
    "corruption",

    # Misc
    "theft",
    "harassment",
    "other"
]

def classify_issue(text: str):
    """Classify issues dynamically using candidate labels"""
    result = classifier(text, CANDIDATE_LABELS)
    
    return  {
        "label": result["labels"][0],   
        "confidence": float(result["scores"][0])
    }

