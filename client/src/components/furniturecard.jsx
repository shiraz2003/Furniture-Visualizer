import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function FurnitureCard(props) {
  // Handle different prop naming patterns and provide fallback
  const furniture = props.furniture || props.item || {};
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Early return if no furniture data
  if (!furniture || Object.keys(furniture).length === 0) {
    return (
      <div className="w-full max-w-[400px] h-auto min-h-[450px] rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <p>No furniture data available</p>
        </div>
      </div>
    );
  }

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Periodic check for changes in the same tab
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Debug image URL
  useEffect(() => {
    if (furniture?.image) {
      console.log('Furniture image URL:', furniture.image);
    }
  }, [furniture?.image]);

  const addToCart = (item) => {
    try {
      let cart = JSON.parse(localStorage.getItem('furnitureCart')) || [];
      
      // Check if item already exists
      const existingItemIndex = cart.findIndex(cartItem => cartItem._id === item._id);
      
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        toast.success('Quantity updated in cart!');
      } else {
        cart.push({ ...item, quantity: 1 });
        toast.success('Furniture added to cart!');
      }
      
      localStorage.setItem('furnitureCart', JSON.stringify(cart));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to add to cart' };
    }
  };

  return (
    <div className="w-full max-w-[400px] h-auto min-h-[450px] rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col bg-white hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden gap-2">
      <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          </div>
        )}
        <img
          src={imageError ? "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image" : (furniture?.image || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Furniture")}
          className={`w-full h-full object-cover rounded-lg cursor-pointer transition-opacity ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onClick={() => {
            if (furniture?._id) {
              navigate(`/furniture-details/${furniture._id}`);
            }
          }}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.log('Image failed to load:', furniture?.image);
            setImageError(true);
            setImageLoading(false);
          }}
          alt={furniture?.name || "Furniture item"}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 line-clamp-2">
          {furniture?.name || "Unnamed Furniture"}
        </h2>
        
        <div className="space-y-2 mb-3">
          <p className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">Category:</span> {furniture?.category || "Unknown"}
          </p>
          <p className="text-gray-700 text-sm sm:text-base line-clamp-2">
            <span className="font-medium">Description:</span> {furniture?.description || "No description"}
          </p>
          {furniture?.dimensions && (
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-medium">Dimensions:</span> {furniture.dimensions}
            </p>
          )}
        </div>
        
        <div className="mt-auto">
          <p className="text-xl font-bold text-green-600 mb-3">
            ${furniture?.price ? furniture.price.toLocaleString() : "0"}
          </p>
          
          <div className="space-y-2">
            <button 
              className="w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              disabled={!isLoggedIn}
              style={{
                backgroundColor: !isLoggedIn ? '#95a5a6' : '#3498db',
                color: !isLoggedIn ? '#7f8c8d' : 'white',
                cursor: !isLoggedIn ? 'not-allowed' : 'pointer',
                opacity: !isLoggedIn ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (isLoggedIn) {
                  e.target.style.backgroundColor = '#2980b9';
                }
              }}
              onMouseLeave={(e) => {
                if (isLoggedIn) {
                  e.target.style.backgroundColor = '#3498db';
                }
              }}
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error('Please login first to add to cart');
                  navigate('/login');
                  return;
                }
                
                const result = addToCart(furniture);
                if (!result.success) {
                  toast.error(result.message);
                }
              }}
            >
              {!isLoggedIn ? "Login to Add to Cart" : "Add to Cart"}
            </button>
            
            <button 
              className="w-full font-medium py-2 px-4 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200"
              onClick={() => {
                if (furniture?._id) {
                  navigate(`/furniture-details/${furniture._id}`);
                }
              }}
            >
              View Details
            </button>
            
            {furniture?.model3DUrl && (
              <button 
                className="w-full font-medium py-2 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                onClick={() => {
                  navigate(`/viewer-3d?model=${encodeURIComponent(furniture.model3DUrl)}&name=${encodeURIComponent(furniture.name || 'Unknown')}`);
                }}
              >
                View in 3D
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}