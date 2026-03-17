import { Link, useNavigate } from "react-router-dom";
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
  // 1. Initial state එකේදීම token එක පරීක්ෂා කිරීමෙන් useEffect error එක විසඳේ
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // 2. Disable scroll logic
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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-[70px] flex items-center justify-between px-6 lg:px-[80px]">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center group z-[110]">
          <span className="text-2xl font-bold text-white tracking-tight">
            Inter<span className="text-[#FFB800]">io.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-medium text-[15px] text-white hover:text-[#FFB800] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-white z-[110]">
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-[#FFB800] transition-colors">
                <IoLogOutOutline size={22} />
              </button>
            ) : (
              <Link to="/login" className="hover:text-[#FFB800] transition-colors">
                <IoPersonOutline size={20} />
              </Link>
            )}
          </div>
          <Link to="/cart" className="hover:text-[#FFB800] transition-colors">
            <IoBagHandleOutline size={22} />
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 text-white"
          >
            {isMobileMenuOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 w-full h-screen bg-black transition-all duration-500 ease-in-out z-[105] ${
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
                className="text-white text-3xl font-bold tracking-tight active:text-[#FFB800]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logout Section at the Bottom */}
          <div className="mt-auto pt-8 border-t border-white/10">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 text-[#FFB800] text-2xl font-bold"
              >
                <IoLogOutOutline size={32} />
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-4 text-[#FFB800] text-2xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoPersonOutline size={32} />
                Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}