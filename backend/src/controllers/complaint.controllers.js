const Complaint = require('../models/Complaints.js');
const { analyzeWithAI } = require('../utils/aiClient.js');

/**
 * Create a new complaint
 */
const createComplaint = async (req, res) => {
  try {
    const { text, address } = req.body;

    // Run AI analysis (sentiment, NER, issue classification, etc.)
    const aiResult = await analyzeWithAI(text);

    const complaint = new Complaint({
      text,
      location: address,
      userId: req.user._id,
      status: "open",
      ai: aiResult,
    }); 

    const saved = await complaint.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get complaint by ID
 */
const getComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (
      String(doc.userId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(doc);
  } catch (err) {
    console.error("Error fetching complaint:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update complaint
 */
const updateComplaint = async (req, res) => {
  try {
    console.log("body:", req.body)
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (
      String(doc.userId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const up = {};
    if (req.body.text) up.text = req.body.text;
    if (req.body.location) up.location = req.body.location;
    if (
      req.body.status &&
      ["open", "in_progress", "resolved"].includes(req.body.status)
    ) {
      up.status = req.body.status;
    }

    const updated = await Complaint.findByIdAndUpdate(doc._id, up, { new: true });
    res.json(updated);
  } catch (err) {
    console.log("Error updating complaint:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Remove complaint
 */
const removeComplaint = async (req, res) => {
  try {
    const doc = await Complaint.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (
      String(doc.userId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await doc.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * List complaints (admin = all, user = own)
 */
const listComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      complaints = await Complaint.aggregate([
        {
          $addFields: {
            urgencyRank: {
              $switch: {
                branches: [
                  { case: { $eq: ["$ai.urgency", "High"] }, then: 1 },
                  { case: { $eq: ["$ai.urgency", "Medium"] }, then: 2 },
                  { case: { $eq: ["$ai.urgency", "Low"] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { urgencyRank: 1, createdAt: -1 } },
      ]);
    } else {
      complaints = await Complaint.aggregate([
        { $match: { userId: req.user._id } },
        {
          $addFields: {
            urgencyRank: {
              $switch: {
                branches: [
                  { case: { $eq: ["$ai.urgency", "High"] }, then: 1 },
                  { case: { $eq: ["$ai.urgency", "Medium"] }, then: 2 },
                  { case: { $eq: ["$ai.urgency", "Low"] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { urgencyRank: 1, createdAt: -1 } },
      ]);
    }

    res.json(complaints);
  } catch (err) {
    console.error("Error listing complaints:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  createComplaint,
  getComplaint,
  updateComplaint,
  removeComplaint,
  listComplaints,
};
