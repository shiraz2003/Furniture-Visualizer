import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaTrash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, ratingFilter]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/reviews/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.furnitureId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter) {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Review deleted successfully');
      fetchAllReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reviews Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by furniture name, user, or comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Stars
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </p>

      {/* Reviews Table */}
      {filteredReviews.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No reviews found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Furniture</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr
                  key={review._id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 border-b text-sm font-semibold">
                    {review.furnitureId.name}
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-gray-500 text-xs">{review.userId.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          color={i < review.rating ? '#FFB800' : '#D1D5DB'}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-gray-700">
                    <div className="max-w-xs line-clamp-2">{review.comment}</div>
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-800 transition inline-flex items-center gap-2"
                      title="Delete review"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReviews;
