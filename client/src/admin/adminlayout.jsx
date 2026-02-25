import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineUsers, 
  HiOutlineCube, 
  HiOutlineLogout,
  HiMenuAlt2,
  HiX 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [userData] = useState({
    name: localStorage.getItem('userName') || 'Adithya Semina',
    role: localStorage.getItem('userRole') || 'Admin'
  });

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    toast.success("Logged out!");
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <HiOutlineHome size={22}/> },
    { name: 'Users', path: '/admin/users', icon: <HiOutlineUsers size={22}/> },
    { name: 'Add Items', path: '/admin/items', icon: <HiOutlineCube size={22}/> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* --- Mobile Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
      `}>
        <div className={`p-8 flex items-center justify-between ${!isSidebarOpen && 'lg:justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <HiOutlineCube size={24} />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold text-slate-800 tracking-tight">Visualizer<span className="text-indigo-600">.</span></span>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><HiX size={24}/></button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all ${
                isActive(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              } ${!isSidebarOpen && 'lg:justify-center'}`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3.5 font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className={`flex items-center w-full px-4 py-3 text-slate-500 hover:text-red-600 rounded-xl ${!isSidebarOpen && 'lg:justify-center'}`}>
            <HiOutlineLogout size={22} />
            {isSidebarOpen && <span className="ml-3.5 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              <HiMenuAlt2 size={26} />
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                {/* Dynamic Name and Role */}
                <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">{userData.role}</p>
             </div>
             {/* Dynamic Avatar Initials */}
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                {getInitials(userData.name)}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 relative"> 
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;