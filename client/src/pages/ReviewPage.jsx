import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { FaStar } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function ReviewPage() {
  const navigate = useNavigate();
  const [furnitureList, setFurnitureList] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const userRole = localStorage.getItem('userRole');

  // Redirect admins away from this page
  useEffect(() => {
    if (userRole === 'admin') {
      toast.error('Only customers can access this page');
      navigate('/admin');
    }
  }, [userRole, navigate]);

  // Fetch furniture list
  useEffect(() => {
    fetchFurniture();
    fetchLatestReviews();
  }, []);

  const fetchFurniture = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/furniture/all`);
      setFurnitureList(response.data);
    } catch (error) {
      console.error('Error fetching furniture:', error);
      toast.error('Failed to load furniture');
    }
  };

  const fetchLatestReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/latest?limit=5`);
      setLatestReviews(response.data);
    } catch (error) {
      console.error('Error fetching latest reviews:', error);
    }
  };

  // Fetch reviews for selected furniture
  useEffect(() => {
    if (selectedFurniture) {
      fetchReviewsForFurniture(selectedFurniture);
    }
  }, [selectedFurniture]);

  const fetchReviewsForFurniture = async (furnitureId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reviews/furniture/${furnitureId}`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedFurniture || !rating || !comment.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        `${API_BASE_URL}/reviews/submit`,
        {
          furnitureId: selectedFurniture,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      fetchReviewsForFurniture(selectedFurniture);
      fetchLatestReviews();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getSelectedFurnitureName = () => {
    const furniture = furnitureList.find(f => f._id === selectedFurniture);
    return furniture ? furniture.name : 'Select Furniture';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Review Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Write a Review</h1>
              <p className="text-gray-600 mb-6">Share your experience with our furniture</p>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Furniture Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Furniture
                  </label>
                  <select
                    value={selectedFurniture}
                    onChange={(e) => setSelectedFurniture(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="">-- Select a furniture item --</option>
                    {furnitureList.map((furniture) => (
                      <option key={furniture._id} value={furniture._id}>
                        {furniture.name} (ID: {furniture._id.slice(-6)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rate this furniture
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition transform hover:scale-110"
                      >
                        <FaStar
                          size={32}
                          color={star <= (hoverRating || rating) ? '#FFB800' : '#D1D5DB'}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-700">
                    {rating > 0 ? `${rating}/10` : 'No rating selected'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this furniture..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none"
                    rows="6"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {comment.length} characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitLoading || !selectedFurniture}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                  {submitLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Reviews for Selected Furniture */}
            {selectedFurniture && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Reviews for {getSelectedFurnitureName()}
                  </h2>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">
                      {averageRating}
                    </p>
                    <p className="text-sm text-gray-600">
                      {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <p className="text-center text-gray-500">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {review.userName}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {[...Array(10)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  size={16}
                                  color={i < review.rating ? '#FFB800' : '#D1D5DB'}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Latest Reviews */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Reviews</h2>

              {latestReviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {latestReviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer hover:bg-indigo-50"
                      onClick={() =>
                        review.furnitureId._id && setSelectedFurniture(review.furnitureId._id)
                      }
                    >
                      <div className="mb-2">
                        <p className="font-semibold text-sm text-gray-800">
                          {review.furnitureId.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          by {review.userName}
                        </p>
                      </div>

                      <div className="flex gap-1 mb-2">
                        {[...Array(10)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            color={i < review.rating ? '#FFB800' : '#D1D5DB'}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-gray-700 line-clamp-2">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
