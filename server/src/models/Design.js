import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
  name: { type: String, default: "My Design" },

  // Owner of this design
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Optional thumbnail (data URL or hosted URL)
  thumbnail: { type: String, default: "" },

  room: {
    width: Number,
    length: Number,
    height: Number,
    floorColor: String,
    wallColor: String
  },
  items: [
    {
      id: String,
      modelId: String,
      sourceFurnitureId: String,
      customModel: {
        id: String,
        name: String,
        category: String,
        modelPath: String,
        defaultRotationY: Number,
        price: Number,
        image: String,
        size: {
          w: Number,
          d: Number,
          h: Number
        }
      },
      x: Number,
      z: Number,
      rotation: Number,
      scale: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Design = mongoose.model("Design", designSchema);
export default Design;