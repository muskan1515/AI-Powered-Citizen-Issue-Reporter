from transformers import pipeline

ner_pipeline = pipeline("ner", model="dslim/bert-base-NER", grouped_entities=True)

def predict_ner(sentence: str):
    """Run Named Entity Recognition and format output in {token, tag} format"""
    raw_output = ner_pipeline(sentence)

    formatted = []
    for i,entity in enumerate(raw_output):
        formatted.append({
            "token": entity["word"] if "word" in entity else entity["entity_group"],
            "tag": entity["entity_group"]
        })

    return formatted