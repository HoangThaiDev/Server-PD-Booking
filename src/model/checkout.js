const { Schema, default: mongoose } = require("mongoose");

const checkoutSchema = new Schema({
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
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    country: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    emailContact: {
      type: String,
    },
    noteOrder: {
      type: String,
    },
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

module.exports = mongoose.model("checkout", checkoutSchema);
