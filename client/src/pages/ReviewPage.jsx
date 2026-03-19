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
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 3;

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
      setReviewsCurrentPage(1); // Reset to page 1 when furniture changes
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
    const furniture = furnitureList.find((f) => f._id === selectedFurniture);
    return furniture ? furniture.name : 'Select Furniture';
  };

  // Pagination helper for reviews
  const getReviewsPaginationData = () => {
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const startIndex = (reviewsCurrentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    return { totalPages, paginatedReviews };
  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-white pb-10">
      <Navbar />

      {/* Added pt-24 or pt-32 to push content below a fixed navbar if you have one */}
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-6xl">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Write a Review</h1>
          <p className="text-[#050315]/60 font-medium text-sm md:text-base">Share your experience and help others find the perfect furniture.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column - Form & Specific Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(5,3,21,0.04)] border border-[#dedcff]/50">
              <form onSubmit={handleSubmitReview} className="space-y-6">
                
                {/* Furniture Selection */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#050315]/50 ml-1 mb-2">
                    Select Furniture
                  </label>
                  <select
                    value={selectedFurniture}
                    onChange={(e) => setSelectedFurniture(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Choose an item to review --</option>
                    {furnitureList.map((furniture) => (
                      <option key={furniture._id} value={furniture._id}>
                        {furniture.name} (ID: {furniture._id.slice(-6)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#050315]/50 ml-1 mb-2">
                    Rate this item
                  </label>
                  <div className="flex items-center gap-4 bg-[#fbfbfe] p-4 rounded-xl border border-[#dedcff]/50 w-fit">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition transform hover:scale-110 active:scale-95"
                        >
                          <FaStar
                            size={28}
                            color={star <= (hoverRating || rating) ? '#FFB800' : '#e5e7eb'}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="h-8 w-px bg-[#dedcff] mx-2"></div>
                    <p className="text-base font-black text-[#050315]">
                      {rating > 0 ? `${rating}/5` : '-'}
                    </p>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-[#050315]/50 ml-1 mb-2">
                    Your Experience
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think about the quality, design, and comfort..."
                    className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-medium text-[#050315] placeholder:text-[#050315]/30 outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all resize-none"
                    rows="5"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-bold text-[#050315]/40">{comment.length} chars</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitLoading || !selectedFurniture}
                  className="w-full bg-[#2f27ce] hover:bg-[#433bff] disabled:bg-[#dedcff] disabled:text-[#2f27ce]/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#2f27ce]/20 active:scale-[0.98]"
                >
                  {submitLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>

            {/* Specific Furniture Reviews */}
            {selectedFurniture && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(5,3,21,0.04)] border border-[#dedcff]/50 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#dedcff]/50">
                  <h2 className="text-xl font-black text-[#050315]">
                    Reviews for {getSelectedFurnitureName()}
                  </h2>
                  <div className="flex items-center gap-4 bg-[#fbfbfe] px-4 py-2 rounded-xl border border-[#dedcff]">
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-[#FFB800] text-xl" />
                      <span className="text-2xl font-black text-[#2f27ce]">{averageRating}</span>
                    </div>
                    <div className="h-6 w-px bg-[#dedcff]"></div>
                    <span className="text-xs font-bold text-[#050315]/60 uppercase tracking-widest">
                      {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 bg-[#fbfbfe] rounded-2xl border-2 border-dashed border-[#dedcff]">
                    <p className="text-[#050315]/40 font-bold uppercase text-xs tracking-widest">No reviews yet. Be the first!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {getReviewsPaginationData().paginatedReviews.map((review) => (
                        <div key={review._id} className="bg-[#fbfbfe] border border-[#dedcff] rounded-2xl p-5 hover:border-[#433bff]/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-black text-sm text-[#050315]">{review.userName}</p>
                              <div className="flex gap-1 mt-1.5">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} size={14} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#050315]/40 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-[#dedcff]/50">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#050315]/80 font-medium leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reviews Pagination Controls */}
                    {getReviewsPaginationData().totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#dedcff]/50">
                        <button
                          onClick={() => setReviewsCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={reviewsCurrentPage === 1}
                          className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                        >
                          ← Previous
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: getReviewsPaginationData().totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setReviewsCurrentPage(page)}
                              className={`px-3.5 py-2 rounded-lg font-bold text-sm transition-all ${
                                reviewsCurrentPage === page
                                  ? 'bg-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30'
                                  : 'bg-white border-2 border-[#dedcff] text-[#050315] hover:bg-[#fbfbfe]'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setReviewsCurrentPage(prev => Math.min(getReviewsPaginationData().totalPages, prev + 1))}
                          disabled={reviewsCurrentPage === getReviewsPaginationData().totalPages}
                          className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Latest Reviews */}
          <div className="lg:col-span-1">
            <div className="bg-[#2f27ce] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#2f27ce]/20 lg:sticky lg:top-28 text-[#fbfbfe] overflow-hidden relative">
              {/* Decorative background blur */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#433bff] rounded-full blur-3xl opacity-50"></div>
              
              <h2 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
                Latest Activity
              </h2>

              {latestReviews.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
                   <p className="text-white/50 font-bold uppercase text-xs tracking-widest">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3 relative z-10">
                  {latestReviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer backdrop-blur-sm group"
                      onClick={() => review.furnitureId?._id && setSelectedFurniture(review.furnitureId._id)}
                    >
                      <div className="mb-2">
                        <p className="font-black text-sm text-white truncate group-hover:text-[#dedcff] transition-colors">
                          {review.furnitureId?.name || 'Deleted Item'}
                        </p>
                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-wider mt-0.5">
                          by {review.userName}
                        </p>
                      </div>

                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={10} color={i < review.rating ? '#FFB800' : 'rgba(255,255,255,0.2)'} />
                        ))}
                      </div>

                      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                        "{review.comment}"
                      </p>
                      <p className="text-[9px] text-white/40 mt-3 font-bold uppercase tracking-widest">
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