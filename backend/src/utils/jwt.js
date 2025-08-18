const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports.signAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });
};

module.exports.signRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
};

module.exports.verifyAccess = (token) => {
  return jwt.verify(token, env.jwt.accessSecret);
};

module.exports.verifyRefresh = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};
