const { Schema, default: mongoose } = require("mongoose");

const transactionSchema = new Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
  },
  infoUser: {
    type: Object,
    required: true,
  },
  cart: {
    items: {
      type: Array,
      required: true,
    },
    totalPriceOfCarts: {
      type: String,
      required: true,
    },
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
