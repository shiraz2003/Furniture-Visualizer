// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { FaStar } from 'react-icons/fa';
// import { HiOutlineTrash, HiOutlineSearch, HiOutlineFilter, HiOutlineExclamationCircle, HiOutlineClock } from 'react-icons/hi';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// function AdminReviews() {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredReviews, setFilteredReviews] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [ratingFilter, setRatingFilter] = useState('');
  
//   // Modal states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const fetchAllReviews = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/reviews/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReviews(response.data);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       toast.error('Failed to load reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllReviews();
//   }, []);

//   const filterReviews = useCallback(() => {
//     let filtered = reviews;

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (review) =>
//           review.furnitureId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (ratingFilter) {
//       filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter));
//     }

//     setFilteredReviews(filtered);
//   }, [reviews, searchTerm, ratingFilter]);

//   useEffect(() => {
//     filterReviews();
//   }, [filterReviews]);

//   const handleDeleteReview = async () => {
//     if (!reviewToDelete) return;
    
//     setDeleteLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_BASE_URL}/reviews/${reviewToDelete._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Review deleted successfully');
//       setShowDeleteModal(false);
//       setReviewToDelete(null);
//       fetchAllReviews();
//     } catch (error) {
//       console.error('Error deleting review:', error);
//       toast.error('Failed to delete review');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-[60vh]">
//         <div className="w-12 h-12 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin mb-4"></div>
//         <p className="text-[#050315]/60 font-bold uppercase text-xs tracking-widest">Loading reviews...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
//         <div>
//           <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Reviews Management</h2>
//           <p className="text-slate-500 text-xs sm:text-sm mt-1">Monitor and manage all customer feedback.</p>
//         </div>

//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <div className="relative flex-1 sm:w-64">
//             <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text"
//               placeholder="Search reviews..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm transition-all shadow-sm"
//             />
//           </div>
//           <div className="relative">
//              <select
//                 value={ratingFilter}
//                 onChange={(e) => setRatingFilter(e.target.value)}
//                 className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm transition-all shadow-sm appearance-none cursor-pointer font-medium text-slate-600"
//               >
//                 <option value="">All Ratings</option>
//                 {[5, 4, 3, 2, 1].map((rating) => (
//                   <option key={rating} value={rating}>{rating} Stars</option>
//                 ))}
//               </select>
//               <HiOutlineFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
//           </div>
//         </div>
//       </div>

//       {/* Reviews Table (Desktop) */}
//       <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-slate-50/50 border-b border-slate-200">
//             <tr>
//               <th className="p-4 text-sm font-semibold text-slate-600">Furniture</th>
//               <th className="p-4 text-sm font-semibold text-slate-600">User</th>
//               <th className="p-4 text-sm font-semibold text-slate-600">Rating</th>
//               <th className="p-4 text-sm font-semibold text-slate-600">Comment</th>
//               <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {filteredReviews.length > 0 ? filteredReviews.map((review) => (
//               <tr key={review._id} className="hover:bg-slate-50/40 transition-colors">
//                 <td className="p-4">
//                   <p className="text-sm font-bold text-slate-700">{review.furnitureId?.name || 'Deleted Item'}</p>
//                   <p className="text-[10px] text-slate-400 uppercase font-medium">ID: {review.furnitureId?._id?.slice(-6) || 'N/A'}</p>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex flex-col">
//                     <span className="text-sm font-bold text-slate-700">{review.userName}</span>
//                     <span className="text-xs text-slate-400">{review.userId?.email || 'No email'}</span>
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} size={12} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
//                     ))}
//                   </div>
//                   <div className="flex items-center text-[10px] text-slate-400 mt-1">
//                      <HiOutlineClock className="mr-1" /> {new Date(review.createdAt).toLocaleDateString()}
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <p className="text-sm text-slate-600 line-clamp-2 max-w-xs italic">"{review.comment}"</p>
//                 </td>
//                 <td className="p-4 text-center">
//                   <button 
//                     onClick={() => { setReviewToDelete(review); setShowDeleteModal(true); }}
//                     className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
//                   >
//                     <HiOutlineTrash size={18} />
//                   </button>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="5" className="p-10 text-center text-slate-400">No reviews found matching your criteria.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="grid grid-cols-1 gap-4 md:hidden">
//         {filteredReviews.map((review) => (
//           <div key={review._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="font-bold text-slate-800">{review.furnitureId?.name || 'Deleted Item'}</h4>
//                 <div className="flex gap-0.5 my-1">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} size={10} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
//                   ))}
//                 </div>
//               </div>
//               <button 
//                 onClick={() => { setReviewToDelete(review); setShowDeleteModal(true); }}
//                 className="p-2 rounded-lg text-red-500 bg-red-50"
//               >
//                 <HiOutlineTrash size={18} />
//               </button>
//             </div>
//             <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
//             <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-[11px] text-slate-400 font-medium">
//               <span>By {review.userName}</span>
//               <span className="flex items-center"><HiOutlineClock className="mr-1" /> {new Date(review.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showDeleteModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
//           <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
//             <HiOutlineExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-bold text-slate-800">Confirm Delete</h3>
//             <p className="text-slate-500 my-3 text-sm">Delete this review from <b>{reviewToDelete?.userName}</b> permanently?</p>
//             <div className="flex gap-3 mt-6">
//               <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
//               <button 
//                 onClick={handleDeleteReview} 
//                 disabled={deleteLoading}
//                 className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
//               >
//                 {deleteLoading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminReviews;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { HiOutlineTrash, HiOutlineSearch, HiOutlineFilter, HiOutlineExclamationCircle, HiOutlineClock } from 'react-icons/hi';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 💡 Backend URL එක හරියටම ගන්න (VITE_BACKEND_URL පාවිච්චි කරන්න)
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      // පොදු reviews route එකට කතා කරමු 
      const response = await axios.get(`${baseUrl}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Backend එකෙන් එන data format එක හරියටම check කරලා array එක ගන්නවා
      let reviewsData = [];
      if (response.data && Array.isArray(response.data)) {
          reviewsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          reviewsData = response.data.data;
      } else if (response.data && response.data.reviews && Array.isArray(response.data.reviews)) {
          reviewsData = response.data.reviews;
      }
      
      // අලුත්ම review එක උඩින් එන විදියට sort කරනවා
      const sortedReviews = reviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(sortedReviews);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback එකක් විදියට /api/reviews/all එකටත් try කරලා බලමු
      try {
          const token = localStorage.getItem('token');
          const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
          const retryResponse = await axios.get(`${baseUrl}/api/reviews/all`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          
          let reviewsData = [];
          if (retryResponse.data && Array.isArray(retryResponse.data)) {
              reviewsData = retryResponse.data;
          } else if (retryResponse.data && retryResponse.data.data && Array.isArray(retryResponse.data.data)) {
              reviewsData = retryResponse.data.data;
          }
          
          setReviews(reviewsData);
      } catch (retryError) {
          toast.error('Failed to load reviews');
          setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const filterReviews = useCallback(() => {
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
  }, [reviews, searchTerm, ratingFilter]);

  useEffect(() => {
    filterReviews();
  }, [filterReviews]);

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      await axios.delete(`${baseUrl}/api/reviews/${reviewToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Review deleted successfully');
      setShowDeleteModal(false);
      setReviewToDelete(null);
      fetchAllReviews(); // Refresh the list
      
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Reviews Management
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">{reviews.length}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Monitor and manage all customer feedback.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm transition-all shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto">
             <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm transition-all shadow-sm appearance-none cursor-pointer font-medium text-slate-600"
              >
                <option value="">All Ratings</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating} Stars</option>
                ))}
              </select>
              <HiOutlineFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Reviews Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/4">Furniture</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/5">User</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/6">Rating</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/3">Comment</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReviews.length > 0 ? filteredReviews.map((review) => (
              <tr key={review._id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{review.furnitureId?.name || 'Deleted Item'}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">ID: {review.furnitureId?._id?.slice(-6) || 'N/A'}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 truncate">{review.userName || 'Anonymous User'}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{review.userId?.email || review.userEmail || 'No email provided'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
                    ))}
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                     <HiOutlineClock className="mr-1" /> {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-slate-600 line-clamp-2 italic pr-4">"{review.comment}"</p>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                      <button 
                        onClick={() => { setReviewToDelete(review); setShowDeleteModal(true); }}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none"
                        title="Delete Review"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <HiOutlineExclamationCircle size={32} className="mb-2 text-slate-300" />
                        <p className="text-sm font-medium">No reviews found matching your criteria.</p>
                    </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredReviews.length > 0 ? filteredReviews.map((review) => (
          <div key={review._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{review.furnitureId?.name || 'Deleted Item'}</h4>
                <div className="flex gap-0.5 my-1.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} color={i < review.rating ? '#FFB800' : '#e5e7eb'} />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => { setReviewToDelete(review); setShowDeleteModal(true); }}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <HiOutlineTrash size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
              <span className="truncate max-w-[150px]">By {review.userName || 'Anonymous'}</span>
              <span className="flex items-center shrink-0"><HiOutlineClock className="mr-1" /> {new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm font-medium">
                No reviews found.
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <HiOutlineTrash size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Delete Review?</h3>
            <p className="text-slate-500 my-3 text-sm leading-relaxed">
                Are you sure you want to permanently delete the review from <b>{reviewToDelete?.userName || 'this user'}</b>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteReview} 
                disabled={deleteLoading}
                className="flex-1 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;