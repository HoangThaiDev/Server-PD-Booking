const { Schema, default: mongoose } = require("mongoose");

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String,
    required: true,
  },
  detail_city: {
    area: {
      type: String,
      required: true,
    },
    attractive_location: {
      type: Array,
      required: true,
    },
    culinary_specialties: {
      type: Array,
      required: true,
    },
    culture: {
      type: Array,
      required: true,
    },
    restaurants: {
      type: Array,
      required: true,
    },
  },
  photos: {
    type: Array,
    required: true,
  },
  resorts: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("city", citySchema);
