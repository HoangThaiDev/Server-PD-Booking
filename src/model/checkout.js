const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema({
  carts: {
    type: Array,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("checkout", checkoutSchema);
