const mongoose = require("mongoose");

const aiSchema = new mongoose.Schema(
  {
    sentiment: {
      label: String,
      confidence: Number,
    },
    issue: {
      label: String,
      confidence: Number,
    },
    ner: [
      {
        token: String,
        tag: String,
      },
    ],
    urgency: { type: String, enum: ["High", "Medium", "Low"], default: "low" },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    ai: aiSchema,
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
