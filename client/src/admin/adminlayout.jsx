import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUsers, HiOutlineLogout } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success("Logged out!");
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center p-3 hover:bg-slate-800 rounded-lg">
            <HiOutlineHome className="mr-3" /> Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center p-3 hover:bg-slate-800 rounded-lg">
            <HiOutlineUsers className="mr-3" /> Users
          </Link>
        </nav>
        <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 flex items-center justify-center">
          <HiOutlineLogout className="mr-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-end">
          <span className="font-medium text-gray-700">Welcome, Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> {/* මෙතනට තමයි Dashboard සහ Users පේජ් ලෝඩ් වෙන්නේ */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;