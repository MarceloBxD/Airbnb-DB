const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocalSchema = new Schema({
  name: String,
  address: String,
  category: String,
  price: Number,
  description: String,
  image: [String],
});

const PlaceModal = mongoose.model("Places", LocalSchema);

module.exports = PlaceModal;
