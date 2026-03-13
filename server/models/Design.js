const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
  name: { type: String, default: "My Design" },
  room: {
    width: Number,
    length: Number,
    height: Number,
    floorColor: String,
    wallColor: String
  },
  items: [
    {
      modelId: String,
      x: Number,
      z: Number,
      rotation: Number,
      scale: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Design", designSchema);