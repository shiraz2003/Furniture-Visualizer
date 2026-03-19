// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import FurnitureCard from '../components/furniturecard';
// import Navbar from '../components/Navbar';
// import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
// import { MdOutlineDashboardCustomize } from 'react-icons/md';

// export default function Furniture() {
//   const [furniture, setFurniture] = useState([]);
//   const [filteredFurniture, setFilteredFurniture] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');

//   useEffect(() => {
//     if (loading) {
//       axios.get(import.meta.env.VITE_BACKEND_URL + '/api/furniture/all')
//         .then(response => {
//           const furnitureData = response.data || [];
//           setFurniture(furnitureData);
//           setFilteredFurniture(furnitureData);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching furniture:', error);
//           setFurniture([]);
//           setFilteredFurniture([]);
//           setLoading(false);
//         })
//     }
//   }, [loading]);

//   // Filter furniture based on search criteria
//   useEffect(() => {
//     let filtered = furniture;

//     if (searchTerm) {
//       filtered = filtered.filter(item => 
//         item.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       filtered = filtered.filter(item => 
//         item.category?.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     if (maxPrice) {
//       filtered = filtered.filter(item => 
//         item.price <= parseFloat(maxPrice)
//       );
//     }

//     setFilteredFurniture(filtered);
//   }, [furniture, searchTerm, selectedCategory, maxPrice]);

//   // Get unique categories for filter dropdowns
//   const getCategories = () => {
//     const categories = furniture.map(item => item.category).filter(Boolean);
//     return [...new Set(categories)];
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setMaxPrice('');
//   };

//   return (
//     <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-white">
//       <Navbar />
      
//       {/* pt-32 ensures content starts below the fixed navbar */}
//       <div className="pt-32 pb-20 w-full min-h-screen">
//         {loading ? (
//           <div className="flex justify-center items-center min-h-[60vh]">
//             <div className="w-16 h-16 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
            
//             {/* Minimal Header Section (Based on Screenshot) */}
//             <div className="mb-12 text-center pt-8 pb-4">
//               <span className="inline-block mb-4 rounded-full border-2 border-[#dedcff]/80 bg-white px-5 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#2f27ce] uppercase shadow-sm">
//                 Premium Collection
//               </span>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#050315] mb-4 tracking-tighter uppercase">
//                 Find Your <span className="text-[#2f27ce]">Perfect</span> Furniture
//               </h1>
//               <p className="text-[#050315]/50 text-sm md:text-base max-w-2xl mx-auto font-medium">
//                 Discover amazing furniture pieces for your home. Curated elegance designed to elevate your living spaces with style and comfort.
//               </p>
//             </div>

//             {/* Filter Panel (Modern Light Theme) */}
//             <div className="mb-12 relative z-20">
//               <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center gap-3">
//                     <FaFilter className="text-[#2f27ce] text-xl" />
//                     <h2 className="text-xl font-black uppercase tracking-wider text-[#050315]">Refine Search</h2>
//                   </div>
//                   <div className="text-xs font-bold text-[#2f27ce] bg-[#dedcff]/50 px-4 py-1.5 rounded-md">
//                     Showing {filteredFurniture.length} of {furniture.length}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
//                   {/* Search Input */}
//                   <div className="space-y-2">
//                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Search Collection</label>
//                     <div className="relative">
//                       <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/30 text-sm" />
//                       <input
//                         type="text"
//                         placeholder="E.g., Velvet Sofa..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-11 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] placeholder:text-[#050315]/30 outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Category Select */}
//                   <div className="space-y-2">
//                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Category</label>
//                     <div className="relative">
//                       <MdOutlineDashboardCustomize className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/30 text-lg" />
//                       <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="w-full pl-11 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all appearance-none cursor-pointer"
//                       >
//                         <option value="">All Categories</option>
//                         {getCategories().map((category) => (
//                           <option key={category} value={category}>
//                             {category.charAt(0).toUpperCase() + category.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Price Input */}
//                   <div className="space-y-2">
//                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Maximum Price</label>
//                     <div className="relative flex items-center">
//                       <span className="absolute left-4 text-[#050315]/30 font-black">$</span>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={maxPrice}
//                         onChange={(e) => setMaxPrice(e.target.value)}
//                         className="w-full pl-9 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] placeholder:text-[#050315]/30 outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Clear Button */}
//                   <div className="space-y-2 flex flex-col justify-end">
//                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1 invisible">Clear</label>
//                     <button
//                       onClick={clearFilters}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-[#050315] hover:bg-[#fbfbfe] rounded-xl border-2 border-[#dedcff] hover:border-[#2f27ce] transition-all duration-300 font-bold text-sm group"
//                     >
//                       <FaTimes className="text-[#050315]/50 group-hover:text-[#2f27ce] transition-colors" />
//                       Reset Filters
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             </div>
            
//             {/* Products Grid */}
//             <div className="relative z-10 pb-10">
//               {filteredFurniture.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center sm:justify-items-stretch">
//                   {filteredFurniture.map((item) => (
//                     <div key={item._id} className="w-full max-w-sm mx-auto transition-transform duration-500 hover:-translate-y-2">
//                       <FurnitureCard furniture={item} />
//                     </div>
//                   ))}
//                 </div>
//               ) : furniture.length > 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border-2 border-dashed border-[#dedcff]">
//                   <div className="w-20 h-20 bg-[#fbfbfe] rounded-full flex items-center justify-center mb-6 border border-[#dedcff]">
//                     <FaSearch className="text-3xl text-[#2f27ce]/40" />
//                   </div>
//                   <h3 className="text-xl font-black text-[#050315] mb-2 uppercase tracking-tighter">No Matches Found</h3>
//                   <p className="text-[#050315]/50 text-center max-w-md mb-8 text-sm font-medium">
//                     We couldn't find any furniture matching your current filters. Try adjusting your search terms or clearing the filters.
//                   </p>
//                   <button 
//                     onClick={clearFilters}
//                     className="px-8 py-3.5 bg-[#2f27ce] text-white font-bold rounded-xl shadow-lg shadow-[#2f27ce]/30 hover:bg-[#433bff] active:scale-95 transition-all duration-300"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center py-20 bg-white rounded-3xl border border-[#dedcff]">
//                   <h3 className="text-xl font-black text-[#050315]/60 mb-2 uppercase tracking-widest">No Inventory Available</h3>
//                   <p className="text-[#050315]/40 text-sm font-medium">Our showroom is currently being updated. Please check back later.</p>
//                 </div>
//               )}
//             </div>
            
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import FurnitureCard from '../components/furniturecard';
import Navbar from '../components/Navbar';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { MdOutlineDashboardCustomize } from 'react-icons/md';

export default function Furniture() {
  const [furniture, setFurniture] = useState([]);
  const [filteredFurniture, setFilteredFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchFurniture = useCallback(() => {
    setLoading(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/furniture/all')
      .then(response => {
        const furnitureData = response.data || [];
        setFurniture(furnitureData);
        setFilteredFurniture(furnitureData);
      })
      .catch(error => {
        console.error('Error fetching furniture:', error);
        setFurniture([]);
        setFilteredFurniture([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchFurniture();
    const handleItemAdded = () => {
      fetchFurniture();
    };

    window.addEventListener('itemAdded', handleItemAdded);

    return () => {
      window.removeEventListener('itemAdded', handleItemAdded);
    };
  }, [fetchFurniture]);

  useEffect(() => {
    let filtered = furniture;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(item => 
        item.price <= parseFloat(maxPrice)
      );
    }

    setFilteredFurniture(filtered);
  }, [furniture, searchTerm, selectedCategory, maxPrice]);

  // Get unique categories for filter dropdowns
  const getCategories = () => {
    const categories = furniture.map(item => item.category).filter(Boolean);
    return [...new Set(categories)];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-white">
      <Navbar />
      
      {/* pt-32 ensures content starts below the fixed navbar */}
      <div className="pt-32 pb-20 w-full min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
            
            {/* Minimal Header Section (Based on Screenshot) */}
            <div className="mb-12 text-center pt-8 pb-4">
              <span className="inline-block mb-4 rounded-full border-2 border-[#dedcff]/80 bg-white px-5 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#2f27ce] uppercase shadow-sm">
                Premium Collection
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#050315] mb-4 tracking-tighter uppercase">
                Find Your <span className="text-[#2f27ce]">Perfect</span> Furniture
              </h1>
              <p className="text-[#050315]/50 text-sm md:text-base max-w-2xl mx-auto font-medium">
                Discover amazing furniture pieces for your home. Curated elegance designed to elevate your living spaces with style and comfort.
              </p>
            </div>

            {/* Filter Panel (Modern Light Theme) */}
            <div className="mb-12 relative z-20">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <FaFilter className="text-[#2f27ce] text-xl" />
                    <h2 className="text-xl font-black uppercase tracking-wider text-[#050315]">Refine Search</h2>
                  </div>
                  <div className="text-xs font-bold text-[#2f27ce] bg-[#dedcff]/50 px-4 py-1.5 rounded-md">
                    Showing {filteredFurniture.length} of {furniture.length}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Search Collection</label>
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/30 text-sm" />
                      <input
                        type="text"
                        placeholder="E.g., Velvet Sofa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] placeholder:text-[#050315]/30 outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Category</label>
                    <div className="relative">
                      <MdOutlineDashboardCustomize className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/30 text-lg" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">All Categories</option>
                        {getCategories().map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1">Maximum Price</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-[#050315]/30 font-black">Rs. </span>
                      <input
                        type="number"
                        placeholder=" 0.00"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-9 pr-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl text-sm font-bold text-[#050315] placeholder:text-[#050315]/30 outline-none focus:ring-4 focus:ring-[#dedcff]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Clear Button */}
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#050315]/50 ml-1 invisible">Clear</label>
                    <button
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-[#050315] hover:bg-[#fbfbfe] rounded-xl border-2 border-[#dedcff] hover:border-[#2f27ce] transition-all duration-300 font-bold text-sm group"
                    >
                      <FaTimes className="text-[#050315]/50 group-hover:text-[#2f27ce] transition-colors" />
                      Reset Filters
                    </button>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="relative z-10 pb-10">
              {filteredFurniture.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center sm:justify-items-stretch">
                  {filteredFurniture.map((item) => (
                    <div key={item._id} className="w-full max-w-sm mx-auto transition-transform duration-500 hover:-translate-y-2">
                      <FurnitureCard furniture={item} />
                    </div>
                  ))}
                </div>
              ) : furniture.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border-2 border-dashed border-[#dedcff]">
                  <div className="w-20 h-20 bg-[#fbfbfe] rounded-full flex items-center justify-center mb-6 border border-[#dedcff]">
                    <FaSearch className="text-3xl text-[#2f27ce]/40" />
                  </div>
                  <h3 className="text-xl font-black text-[#050315] mb-2 uppercase tracking-tighter">No Matches Found</h3>
                  <p className="text-[#050315]/50 text-center max-w-md mb-8 text-sm font-medium">
                    We couldn't find any furniture matching your current filters. Try adjusting your search terms or clearing the filters.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="px-8 py-3.5 bg-[#2f27ce] text-white font-bold rounded-xl shadow-lg shadow-[#2f27ce]/30 hover:bg-[#433bff] active:scale-95 transition-all duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#dedcff]">
                  <h3 className="text-xl font-black text-[#050315]/60 mb-2 uppercase tracking-widest">No Inventory Available</h3>
                  <p className="text-[#050315]/40 text-sm font-medium">Our showroom is currently being updated. Please check back later.</p>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}