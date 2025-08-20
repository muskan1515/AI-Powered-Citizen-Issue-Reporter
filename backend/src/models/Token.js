const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    kind: { type: String, enum: ["refresh", "reset"], required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    meta: { type: Object },
  },
  { timestamps: true }
);

// Indexes
TokenSchema.index({ kind: 1, tokenHash: 1 });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance method to compare a raw token with hashed token
TokenSchema.methods.compareToken = async function (rawToken) {
  return bcrypt.compare(rawToken, this.tokenHash);
};

// Static method to hash a token before saving
TokenSchema.statics.hashToken = async function (rawToken) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(rawToken, salt);
};

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
