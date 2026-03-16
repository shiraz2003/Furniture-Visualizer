import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  IoLogOut,
  IoSearchOutline,
  IoPersonOutline,
  IoCartOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav
      className="w-full h-[80px] relative z-50 bg-amber-500"
      style={{ filter: "drop-shadow(0px 0px 16px rgba(0, 0, 0, 0.25))" }}
    >
      {/* ===== NAVBAR ===== */}
      <div className="max-w-[1440px] mx-auto h-full flex items-center px-4 sm:px-6 lg:px-[50px] relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white hover:opacity-80 transition-opacity mr-4"
        >
          {isMobileMenuOpen ? (
            <IoCloseOutline size={24} />
          ) : (
            <IoMenuOutline size={24} />
          )}
        </button>

        {/* Nav Links - Centered (Desktop Only) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-[56px]">
          <Link
            to="/dashboard"
            className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
          >
            Home
          </Link> 
          <Link
            to="/furniture"
            className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
          >
            Furniture
          </Link>
          
          <Link
            to="/editor-2d"
            className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
          >
            Design
          </Link>
          <Link
            to="/reviews"
            className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
          >
            Reviews
          </Link>
           <Link
            to="/profile"
            className="font-montserrat font-normal text-[18px] leading-[22px] text-white hover:opacity-80 transition-opacity"
          >
            profile
          </Link>
        </div>
        

        {/* Right Icons */}
        <div className="ml-auto flex items-center gap-0">
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-[4px] px-[6px] lg:px-[10px] py-[10px] cursor-pointer"
            >
              <IoLogOut size={20} className="text-white" />
              <span className="hidden lg:inline font-montserrat font-normal text-[18px] leading-[22px] text-white">
                Logout
              </span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-[4px] px-[6px] lg:px-[10px] py-[10px] cursor-pointer"
            >
              <IoPersonOutline size={20} className="text-white" />
              <span className="hidden lg:inline font-montserrat font-normal text-[18px] leading-[22px] text-white">
                Account
              </span>
            </Link>
          )}
          <Link
            to="/cart"
            className="flex items-center gap-[4px] px-[6px] lg:px-[10px] py-[10px] cursor-pointer"
          >
            <IoCartOutline size={20} className="text-white" />
            <span className="hidden lg:inline font-montserrat font-normal text-[18px] leading-[22px] text-white">
              Cart
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 z-40">
          <div className="flex flex-col py-4 px-4 space-y-2">
            <Link
              to="/dashboard"
              className="font-montserrat font-normal text-[16px] text-white hover:opacity-80 transition-opacity py-3 px-2 border-b border-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/furniture"
              className="font-montserrat font-normal text-[16px] text-white hover:opacity-80 transition-opacity py-3 px-2 border-b border-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Furniture
            </Link>
            <Link
              to="/profile"
              className="font-montserrat font-normal text-[16px] text-white hover:opacity-80 transition-opacity py-3 px-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
          </div>
        </div>
      )}
    </nav>
  );
}
