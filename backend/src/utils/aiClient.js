const axios = require('axios');
const env = require('../config/env');

const SENTIMENT_URL = `${env.ai_client.base_url}/sentiment/predict/`;
const ISSUE_URL = `${env.ai_client.base_url}/issue/predict/`;
const NER_URL = `${env.ai_client.base_url}/ner/predict/`;

// Define weights
const ISSUE_URGENCY = {
  "Safety Issue": 1.0,
  "Connectivity Issue": 0.7,
  "Billing Issue": 0.5,
  "General Inquiry": 0.2,
};

const SENTIMENT_URGENCY = {
  Positive: 0.0,
  Neutral: 0.5,
  Negative: 1.0
};

const KEYWORD_URGENCY = {
  fire: 1.0,
  accident: 1.0,
  outage: 0.8,
  urgent: 0.9
};

const analyzeWithAI = async (text) => {
  // -------- Mock response --------
  const useMock = true;
  if (useMock) {
    const mockResponse = {
      sentiment: { label: "Negative", confidence: 0.92 },
      issue: { label: "Connectivity Issue", confidence: 0.87 },
      ner: [
        { token: "John", tag: "PERSON" },
        { token: "New York", tag: "LOCATION" },
        { token: "billing", tag: "ISSUE_TYPE" }
      ]
    };

    return { ...mockResponse, urgency: getUrgencyLabel(mockResponse) };
  }
  // ------------------------------

  const [sentiment, issue, ner] = await Promise.all([
    axios.post(SENTIMENT_URL, { text }).then(r => r.data).catch(() => null),
    axios.post(ISSUE_URL, { text }).then(r => r.data).catch(() => null),
    axios.post(NER_URL, { text }).then(r => r.data).catch(() => null)
  ]);

  const result = { sentiment, issue, ner };
  result.urgency = getUrgencyLabel(result);
  return result;
};

// Calculate numeric score first
const calculateUrgencyScore = ({ sentiment, issue, ner }) => {
  let score = 0;

  if (sentiment && sentiment.label) {
    score += (SENTIMENT_URGENCY[sentiment.label] || 0) * (sentiment.confidence || 1);
  }

  if (issue && issue.label) {
    score += (ISSUE_URGENCY[issue.label] || 0) * (issue.confidence || 1);
  }

  if (ner && Array.isArray(ner)) {
    ner.forEach(item => {
      const keyword = item.token.toLowerCase();
      if (KEYWORD_URGENCY[keyword]) score += KEYWORD_URGENCY[keyword];
    });
  }

  // Normalize between 0 and 1
  if (score > 1) score = 1;
  return score;
};

// Convert numeric score to label
const getUrgencyLabel = (data) => {
  const score = calculateUrgencyScore(data);
  if (score >= 0.7) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
};

module.exports = { analyzeWithAI };
