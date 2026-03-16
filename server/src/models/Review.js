import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    furnitureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
