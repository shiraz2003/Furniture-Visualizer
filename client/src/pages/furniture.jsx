import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FurnitureCard from '../components/furniturecard';
import Navbar from '../components/Navbar';

export default function Furniture() {
  const [furniture, setFurniture] = useState([]);
  const [filteredFurniture, setFilteredFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (loading) {
      axios.get(import.meta.env.VITE_BACKEND_URL + '/api/furniture/all')
        .then(response => {
          const furnitureData = response.data || [];
          setFurniture(furnitureData);
          setFilteredFurniture(furnitureData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching furniture:', error);
          setFurniture([]);
          setFilteredFurniture([]);
          setLoading(false);
        })
    }
  }, [loading]);

  // Filter furniture based on search criteria
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
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
        <div className="pt-4 pb-16">
          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Find Your Perfect Furniture
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Discover amazing furniture pieces for your home
                </p>
                <div className="text-sm text-slate-400 mt-2">
                  Total: {furniture.length} item{furniture.length !== 1 ? 's' : ''} | 
                  Showing: {filteredFurniture.length} item{filteredFurniture.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Search and Filter Section */}
              <div className="mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-4 sm:p-6 border border-white/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search by Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Search by Name</label>
                      <input
                        type="text"
                        placeholder="Enter furniture name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Filter by Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Filter by Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="" className="text-black">All Categories</option>
                        {getCategories().map((category) => (
                          <option key={category} value={category} className="text-black">{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter by Max Price */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Max Price ($)</label>
                      <input
                        type="number"
                        placeholder="Max price..."
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Clear Filters Button */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white invisible">Clear</label>
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium text-sm"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {filteredFurniture.length > 0 ? (
                  filteredFurniture.map((item) => (
                    <div key={item._id} className="w-full max-w-sm">
                      <FurnitureCard furniture={item} />
                    </div>
                  ))
                ) : furniture.length > 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">No furniture matches your search criteria</h3>
                    <p className="text-slate-300 mb-4">Try adjusting your search terms or clear the filters</p>
                    <button 
                      onClick={clearFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">No furniture available</h3>
                    <p className="text-slate-300">Check back later for new items.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}