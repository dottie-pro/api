const mongoose = require("mongoose");
const { Schema } = mongoose;

const logoSchema = new Schema({
  name: String,
  size: Number,
  key: String,
  alt: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Logo = mongoose.model("Logo", logoSchema);

module.exports = Logo;
