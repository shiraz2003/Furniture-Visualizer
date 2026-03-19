import Furniture from "../../models/admin/furnituremodel.js";
import fs from "fs";
import path from "path";

const normalizeImageInput = (rawImage) => {
  if (!rawImage) {
    return [];
  }

  if (Array.isArray(rawImage)) {
    return rawImage.filter(Boolean);
  }

  if (typeof rawImage === "string") {
    try {
      const parsed = JSON.parse(rawImage);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      // Keep backward compatibility for single URL strings.
      return rawImage ? [rawImage] : [];
    }

    return rawImage ? [rawImage] : [];
  }

  return [];
};

const normalizeItemImages = (item) => {
  if (!item) {
    return item;
  }

  const normalizedImage = normalizeImageInput(item.image);
  const plain = item.toObject ? item.toObject() : item;
  return {
    ...plain,
    image: normalizedImage,
  };
};

// භාණ්ඩයක් එකතු කිරීම
export const addFurniture = async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body;
    if (!req.file) return res.status(400).json({ message: "Please upload a GLB file." });

    const imageUrls = normalizeImageInput(image);
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    const newFurniture = new Furniture({
      name,
      category,
      description,
      price: Number(price),
      image: imageUrls,
      model3DUrl: req.file.path
    });

    await newFurniture.save();
    res.status(201).json({ message: "Item added successfully!", data: newFurniture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// සියලුම භාණ්ඩ ලබා ගැනීම
export const getFurniture = async (req, res) => {
  try {
    const items = await Furniture.find().sort({ createdAt: -1 });
    const normalizedItems = items.map((item) => normalizeItemImages(item));
    res.status(200).json(normalizedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// එක් භාණ්ඩයක් ලබා ගැනීම
export const getFurnitureById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Furniture.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ data: normalizeItemImages(item) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// භාණ්ඩයක් මකා දැමීම
export const deleteFurniture = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Furniture.findById(id);
    
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 1. Local Server ෆෝල්ඩරයේ ඇති GLB ෆයිල් එක මකා දැමීම
    if (item.model3DUrl && fs.existsSync(item.model3DUrl)) {
      try {
        fs.unlinkSync(item.model3DUrl);
      } catch (err) {
        console.error("Error deleting file from folder:", err);
      }
    }

    // 2. MongoDB දත්ත මකා දැමීම
    await Furniture.findByIdAndDelete(id);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// භාණ්ඩයක් යාවත්කාලීන කිරීම (Update)
export const updateFurniture = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, image } = req.body;
    
    const item = await Furniture.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    let model3DUrl = item.model3DUrl;

    // නව GLB ෆයිල් එකක් ඇත්නම් පැරණි එක මකා දමන්න
    if (req.file) {
      if (fs.existsSync(item.model3DUrl)) {
        fs.unlinkSync(item.model3DUrl);
      }
      model3DUrl = req.file.path;
    }

    const imageUrls = normalizeImageInput(image);
    const normalizedExistingImages = Array.isArray(item.image)
      ? item.image
      : item.image
        ? [item.image]
        : [];

    const updatedItem = await Furniture.findByIdAndUpdate(
      id,
      {
        name,
        category,
        description,
        price: Number(price),
        image: imageUrls.length > 0 ? imageUrls : normalizedExistingImages,
        model3DUrl
      },
      { new: true }
    );

    res.status(200).json({ message: "Item updated successfully!", data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};