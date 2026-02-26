import Furniture from "../../models/admin/furnituremodel.js";
import fs from "fs";
import path from "path";

export const addFurniture = async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body;
    if (!req.file) return res.status(400).json({ message: "Please upload a GLB file." });

    const newFurniture = new Furniture({
      name,
      category,
      description,
      price: Number(price),
      image,
      model3DUrl: req.file.path
    });

    await newFurniture.save();
    res.status(201).json({ message: "Item added successfully!", data: newFurniture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFurniture = async (req, res) => {
  try {
    const items = await Furniture.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- අලුතින් එක් කළ Delete Function එක ---
export const deleteFurniture = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Furniture.findById(id);
    
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 1. Local Server එකේ තියෙන GLB ෆයිල් එක මැකීම
    if (fs.existsSync(item.model3DUrl)) {
      fs.unlinkSync(item.model3DUrl);
    }

    // 2. MongoDB දත්ත මැකීම
    await Furniture.findByIdAndDelete(id);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};