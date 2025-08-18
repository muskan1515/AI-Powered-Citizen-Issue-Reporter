const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  kind: { type: String, enum: ['refresh', 'reset'], required: true },
  tokenHash: { type: String, required: true }, 
  expiresAt: { type: Date, required: true },
  meta: { type: Object }, 
}, { timestamps: true });

TokenSchema.index({ kind: 1, tokenHash: 1 });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token