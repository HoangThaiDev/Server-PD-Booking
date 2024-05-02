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
    orderNotes: {
      type: String,
    },
    default: Object,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
