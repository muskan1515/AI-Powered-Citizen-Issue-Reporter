 const dotenv = require('dotenv')
dotenv.config();

const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d'
  },

  resetTokenExpiresMin: parseInt(process.env.RESET_TOKEN_EXPIRES_MIN || '30', 10),

  cookie: {
    name: process.env.COOKIE_NAME || 'refreshToken',
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE || 'Lax'),
  },

  nodemailer: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    user_email: process.env.EMAIL_USER || 'your_email@gmail.com',
    email_pass: process.env.EMAIL_PASS || 'your_email_password',
    from: process.env.EMAIL_FROM || 'no-reply@yourdomain.com'
  },

  ai_client: {
    base_url: process.env.AI_SERVICE_BASE || "http://localhost:8000"
  }
};

module.exports = env