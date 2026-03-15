import express from 'express';
import Design from '../models/Design.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All design routes require authentication
router.use(authenticateToken);

// Get current user's saved designs (List view)
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const designs = await Design.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Save a new design (owned by current user)
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, room, items, thumbnail } = req.body;
    const newDesign = new Design({ name, room, items, thumbnail, user: userId });
    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save design' });
  }
});

// Load a design by ID (must belong to current user)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const design = await Design.findOne({ _id: req.params.id, user: userId });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load design' });
  }
});

export default router;