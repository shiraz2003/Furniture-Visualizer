import Review from "../models/Review.js";
import Furniture from "../models/admin/furnituremodel.js";
import User from "../models/User.js";

// Submit a review
export const submitReview = async (req, res) => {
  try {
    const { furnitureId, rating, comment } = req.body;
    const authEmail = req.user?.email;

    // Validate inputs
    if (!furnitureId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: "Rating must be between 1 and 10" });
    }

    if (!authEmail) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: authEmail }).select("_id firstname lastname role");
    if (!user) {
      return res.status(401).json({ message: "User not found for token" });
    }

    if (user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can submit reviews" });
    }

    const userId = user._id;
    const userName = `${user.firstname} ${user.lastname}`;

    // Check if furniture exists
    const furniture = await Furniture.findById(furnitureId);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    // Check if user already reviewed this furniture
    const existingReview = await Review.findOne({
      furnitureId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this furniture" 
      });
    }

    // Create new review
    const review = new Review({
      furnitureId,
      userId,
      rating,
      comment,
      userName,
    });

    await review.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review", error: error.message });
  }
};

// Get reviews by furniture ID
export const getReviewsByFurniture = async (req, res) => {
  try {
    const { furnitureId } = req.params;

    const reviews = await Review.find({ furnitureId })
      .populate("userId", "firstname lastname")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.status(200).json({
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// Get latest reviews (for the latest reviews section)
export const getLatestReviews = async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const reviews = await Review.find()
      .populate("furnitureId", "name image")
      .populate("userId", "firstname lastname")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching latest reviews:", error);
    res.status(500).json({ message: "Error fetching latest reviews", error: error.message });
  }
};

// Get all reviews (admin only - for moderation)
export const getAllReviews = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const reviews = await Review.find()
      .populate("furnitureId", "name")
      .populate("userId", "firstname lastname email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Error fetching all reviews", error: error.message });
  }
};

// Delete review (admin only)
export const deleteReview = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
