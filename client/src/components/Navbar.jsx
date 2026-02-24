
import { Link, useNavigate } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiHome, HiShoppingBag, HiInformationCircle, HiMail } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";
import toast from "react-hot-toast";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
       <header className="w-full h-auto sm:h-[100px] md:h-[120px] lg:h-[60px] bg-amber-800 text-secondary shadow-md relative z-50 lg:p-8">
           <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0">
               {/* Mobile Menu Button - Left */}
               <div className="flex items-center lg:hidden">
                   <button 
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="text-secondary hover:text-white transition-colors"
                   >
                       {isMenuOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
                   </button>
               </div>

               {/* Logo - Centered on mobile, left on desktop */}
               <Link to="/dashboard" className="absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none flex items-center gap-2 hover:opacity-80 transition-opacity">
                   <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
               </Link>

               {/* Desktop Navigation */}
               <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                   <Link to="/dashboard" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Dashboard
                   </Link>
                   <Link to="/room-setup" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Room Setup
                   </Link>
                   <Link to="/editor-2d" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Editor 2D
                   </Link>
                   <Link to="/viewer-3d" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Viewer 3D
                   </Link>
               </nav>

               {/* Right Side - Cart and Auth */}
               <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto lg:ml-0">
                   <Link to="/cart" className="hover:text-white hover:scale-110 transition-transform duration-200">
                       <BiCart className="text-2xl sm:text-3xl" />
                   </Link>
                   {isLoggedIn ? (
                       <button
                           onClick={handleLogout}
                           className="flex items-center gap-2 text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200"
                       >
                           <IoLogOut className="text-xl sm:text-2xl" />
                           <span className="hidden sm:inline">Logout</span>
                       </button>
                   ) : (
                       <>
                           <Link to="/login" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                               Login
                           </Link>
                           <Link to="/register" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                               Register
                           </Link>
                       </>
                   )}
               </div>
           </div>

           {/* Mobile Menu */}
           {isMenuOpen && (
               <nav className="lg:hidden bg-amber-800 border-t border-secondary/20 py-4 absolute w-full z-40 shadow-lg">
                   <div className="flex flex-col gap-3 px-6">
                       <Link 
                           to="/dashboard" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiHome className="text-2xl" />
                           Dashboard
                       </Link>
                       <Link 
                           to="/room-setup" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiShoppingBag className="text-2xl" />
                           Room Setup
                       </Link>
                       <Link 
                           to="/editor-2d" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiInformationCircle className="text-2xl" />
                           Editor 2D
                       </Link>
                       <Link 
                           to="/viewer-3d" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiMail className="text-2xl" />
                           Viewer 3D
                       </Link>
                       {isLoggedIn && (
                           <button
                               onClick={() => {
                                   handleLogout();
                                   setIsMenuOpen(false);
                               }}
                               className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3 text-left border-t border-secondary/20 mt-2 pt-4"
                           >
                               <IoLogOut className="text-2xl" />
                               Logout
                           </button>
                       )}
                   </div>
               </nav>
           )}
       </header>
    );
}