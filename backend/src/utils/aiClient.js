const axios = require('axios')
const env = require('../config/env')

const SENTIMENT_URL = `${env.ai_client.base_url}/sentiment/`;
const ISSUE_URL = `${env.ai_client.base_url}/issue/`;
const NER_URL = `${env.ai_client.base_url}/ner/`;

const analyzeWithAI = async (text) => {
  const [sentiment, issue, ner] = await Promise.all([
    axios.post(SENTIMENT_URL, { text }).then(r => r.data).catch(() => null),
    axios.post(ISSUE_URL, { text }).then(r => r.data).catch(() => null),
    axios.post(NER_URL, { text }).then(r => r.data).catch(() => null)
  ]);

  return { sentiment, issue, ner };
}

module.exports = {analyzeWithAI}