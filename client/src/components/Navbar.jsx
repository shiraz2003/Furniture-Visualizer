import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoBagHandleOutline,
  IoMenuOutline,
  IoCloseOutline
} from "react-icons/io5";
import toast from "react-hot-toast";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // 1. Get current path location
  const location = useLocation();

  // 2. Check if the current page is Home (Dashboard)
  const isHomePage = location.pathname === "/dashboard" || location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Furniture", path: "/furniture" },
    { name: "Design", path: "/room-setup" },
    { name: "Reviews", path: "/reviews" },
    { name: "Profile", path: "/profile" },
  ];

  // 3. Logic to determine text color and background
  // - Text is dark if: Mobile menu is open, OR it's scrolled, OR it's NOT the Home page
  const isDarkText = isScrolled || isMobileMenuOpen || !isHomePage;
  const textColorClass = isDarkText ? "text-slate-900" : "text-white";

  // - Background is white if: it's scrolled, OR it's NOT the Home page
  const isWhiteBg = isScrolled || !isHomePage;
  const bgClass = isWhiteBg ? "bg-white shadow-md" : "bg-transparent";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${bgClass}`}
    >
      <div className="max-w-[1440px] mx-auto h-[70px] flex items-center justify-between px-6 lg:px-[80px]">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center group z-[110]">
          <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${textColorClass}`}>
            Design<span className="text-[#FBBF24]">Lab</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium text-[15px] hover:text-[#FBBF24] transition-colors duration-300 ${textColorClass}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className={`flex items-center gap-4 z-[110] transition-colors duration-300 ${textColorClass}`}>
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-[#FBBF24] transition-colors">
                <IoLogOutOutline size={22} />
              </button>
            ) : (
              <Link to="/login" className="hover:text-[#FBBF24] transition-colors">
                <IoPersonOutline size={20} />
              </Link>
            )}
          </div>
          <Link to="/cart" className="hover:text-[#FBBF24] transition-colors">
            <IoBagHandleOutline size={22} />
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 transition-colors hover:text-[#FBBF24]"
          >
            {isMobileMenuOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay (White Background) */}
      <div 
        className={`lg:hidden fixed inset-0 w-full h-screen bg-white transition-all duration-500 ease-in-out z-[105] ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col h-full pt-[100px] px-10 pb-12">
          {/* Menu Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-900 text-3xl font-bold tracking-tight hover:text-[#FBBF24] active:text-[#FBBF24] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logout/Account Section at the Bottom */}
          <div className="mt-auto pt-8 border-t border-slate-200">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 text-slate-900 text-2xl font-bold hover:text-[#FBBF24] transition-colors"
              >
                <IoLogOutOutline size={32} className="text-[#FBBF24]" />
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-4 text-slate-900 text-2xl font-bold hover:text-[#FBBF24] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoPersonOutline size={32} className="text-[#FBBF24]" />
                Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}