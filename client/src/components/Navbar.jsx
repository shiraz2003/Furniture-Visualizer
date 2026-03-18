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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/dashboard" || location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
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

  const isDarkText = isScrolled || isMobileMenuOpen || !isHomePage;
  const textColorClass = isDarkText ? "text-[#050315]" : "text-white";
  const bgClass = isScrolled || !isHomePage ? "bg-[#fbfbfe] shadow-lg shadow-[#050315]/5" : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${bgClass}`}>
      <div className="max-w-[1440px] mx-auto h-[80px] flex items-center justify-between px-6 lg:px-[80px]">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center group z-[110]">
          <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${textColorClass}`}>
            Design<span className="text-[#2f27ce]">Lab.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-bold text-[14px] uppercase tracking-widest hover:text-[#2f27ce] transition-colors duration-300 ${textColorClass}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className={`flex items-center gap-5 z-[110] transition-colors duration-300 ${textColorClass}`}>
           <Link to="/cart" className="hover:text-[#2f27ce] transition-all hover:scale-110 relative">
            <IoBagHandleOutline size={24} />
          </Link>
          <div className="hidden lg:flex items-center gap-5">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-[#2f27ce] transition-all hover:scale-110">
                <IoLogOutOutline size={24} />
              </button>
            ) : (
              <Link to="/login" className="hover:text-[#2f27ce] transition-all hover:scale-110">
                <IoPersonOutline size={22} />
              </Link>
            )}
          </div>
         

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1 transition-colors hover:text-[#2f27ce]">
            {isMobileMenuOpen ? <IoCloseOutline size={30} /> : <IoMenuOutline size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 w-full h-screen bg-[#fbfbfe] transition-all duration-500 ease-in-out z-[105] ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full pt-[120px] px-10 pb-12">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[#050315] text-3xl font-black tracking-tighter hover:text-[#2f27ce] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-8 border-t border-[#dedcff]">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-4 text-[#050315] text-2xl font-black hover:text-[#2f27ce]">
                <IoLogOutOutline size={32} className="text-[#2f27ce]" /> Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-4 text-[#050315] text-2xl font-black hover:text-[#2f27ce]" onClick={() => setIsMobileMenuOpen(false)}>
                <IoPersonOutline size={32} className="text-[#2f27ce]" /> Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}