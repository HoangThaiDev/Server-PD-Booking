const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  session: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
