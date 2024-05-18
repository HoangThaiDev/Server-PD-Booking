const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
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
  cart: {
    items: [
      {
        roomId: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },
        photo: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        date: {
          startDate: {
            type: String,
            required: true,
          },
          endDate: {
            type: String,
            required: true,
          },
        },
        options: {
          type: Object,
          required: true,
        },
        rooms: {
          type: Array,
          required: true,
        },
        services: {
          type: Object,
          required: true,
        },
        priceRoom: {
          type: String,
          required: true,
        },
        totalPrice: {
          type: String,
          required: true,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

module.exports = mongoose.model("cart", cartSchema);
