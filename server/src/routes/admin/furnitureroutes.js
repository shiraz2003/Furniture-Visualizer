import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { addFurniture, getFurniture, deleteFurniture } from "../../controllers/admin/furniturecontroller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src", "uploads", "models");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".glb") {
    cb(null, true);
  } else {
    cb(new Error("Only .glb files are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// API Routes
router.post("/add", upload.single("glbFile"), addFurniture);
router.get("/all", getFurniture);
router.delete("/delete/:id", deleteFurniture); // මකා දැමීමේ route එක

export default router;