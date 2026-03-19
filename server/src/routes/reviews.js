import express from "express";
import {
  submitReview,
  getReviewsByFurniture,
  getLatestReviews,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit a review (users only)
router.post("/submit", authenticateToken, submitReview);

// Get reviews by furniture ID (public)
router.get("/furniture/:furnitureId", getReviewsByFurniture);

// Get latest reviews (public)
router.get("/latest", getLatestReviews);

// Get all reviews (admin only)
router.get("/all", authenticateToken, getAllReviews);

// Delete review (admin only)
router.delete("/:reviewId", authenticateToken, deleteReview);

export default router;
