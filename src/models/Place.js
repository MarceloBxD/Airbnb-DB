const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocalSchema = new Schema({
  placeid: {
    type: Schema.Types.ObjectId,
  },
  name: String,
  address: String,
  category: String,
  price: Number,
  description: String,
  image: [String],
});

const PlaceModal = mongoose.model("Place", LocalSchema);

module.exports = PlaceModal;
