const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  detail: {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    country: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
