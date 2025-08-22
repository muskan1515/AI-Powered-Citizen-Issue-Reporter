const axios = require("axios");
const env = require("../config/env");

const PREDICT_URL = `${env.ai_client.base_url}/predict`;

const analyzeWithAI = async (text) => {
  const [analyzeRes] = await Promise.all([
    axios
      .post(PREDICT_URL, { text })
      .then((r) => r.data)
      .catch(() => null),
  ]);

  console.log({ analyzeRes });
  return analyzeRes;
};

module.exports = { analyzeWithAI };
