import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

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
          review.furnitureId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin mb-4"></div>
        <p className="text-[#050315]/60 font-bold uppercase text-xs tracking-widest">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#050315] tracking-tight">Reviews Management</h1>
        <p className="text-[#050315]/50 font-medium text-sm">Monitor and manage all customer feedback.</p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-3xl border border-[#dedcff]/50 shadow-sm">
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/20" />
          <input
            type="text"
            placeholder="Search by furniture, user, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-sm transition-all"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/20" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-sm transition-all cursor-pointer appearance-none"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count Indicator */}
      <div className="mb-4 flex items-center justify-between px-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40">
           Found {filteredReviews.length} results
        </span>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-[2rem] border border-[#dedcff]/50 shadow-xl shadow-[#050315]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfbfe] border-b border-[#dedcff]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#050315]/60">Furniture</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#050315]/60">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#050315]/60">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#050315]/60">Comment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#050315]/60 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dedcff]/30">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <p className="text-[#050315]/30 font-bold uppercase text-xs tracking-widest">No reviews found matching your search</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-[#fbfbfe] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-[#050315]">{review.furnitureId?.name || 'Deleted Item'}</p>
                      <p className="text-[10px] font-bold text-[#050315]/40 uppercase">ID: {review.furnitureId?._id?.slice(-6) || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#dedcff] flex items-center justify-center text-[#2f27ce] font-black text-xs">
                          {review.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#050315]">{review.userName}</p>
                          <p className="text-[10px] font-medium text-[#050315]/50">{review.userId?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
                        ))}
                      </div>
                      <p className="text-[9px] font-black text-[#050315]/40 mt-1 uppercase">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-[#050315]/70 line-clamp-2 italic font-medium leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-3 rounded-xl bg-white border border-[#dedcff] text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95 shadow-sm"
                        title="Delete review"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;