import mongoose from "mongoose";

const furnitureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Living Room", "Bedroom", "Office", "Kitchen"] 
    },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Supabase Public URL
    model3DUrl: { type: String, required: true }, // Local Path (.glb)
  },
  { timestamps: true }
);

export default mongoose.model("Furniture", furnitureSchema);