const { Schema, default: mongoose } = require("mongoose");

const resortSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  cheapestPrice: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rooms: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("resort", resortSchema);
