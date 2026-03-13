import express from 'express';
import Design from '../models/Design.js';

const router = express.Router();

// Get all saved designs (List view)
router.get('/', async (req, res) => {
  try {
    // Only fetching generic data to keep the payload small. 
    // You can exclude large arrays for the list view if needed.
    const designs = await Design.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

// Save a new design
router.post('/', async (req, res) => {
  try {
    const { room, items } = req.body;
    const newDesign = new Design({ room, items });
    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save design" });
  }
});

// Load a design by ID
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ error: "Failed to load design" });
  }
});

export default router;