const { Schema, default: mongoose } = require("mongoose");

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  vat: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  numberRooms: {
    type: Array,
    required: true,
  },
  discount_price: {
    type: String,
    required: true,
  },
  detail: {
    maxPeople: {
      type: Number,
      required: true,
    },
    bed: {
      type: String,
      required: true,
    },
    smoking: {
      type: Boolean,
      required: true,
    },
    wifi: {
      type: Boolean,
      required: true,
    },
    bathRoom: {
      type: Array,
      required: true,
    },
  },
});

module.exports = mongoose.model("room", roomSchema);
