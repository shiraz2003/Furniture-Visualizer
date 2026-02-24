import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { HiOutlineMenuAlt2, HiOutlineHome, HiOutlineUsers, HiOutlineCube, HiOutlineLogout } from 'react-icons/hi';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <HiOutlineHome size={22}/>, path: '/admin' },
    { name: 'Users', icon: <HiOutlineUsers size={22}/>, path: '/admin/users' },
    { name: 'Projects', icon: <HiOutlineCube size={22}/>, path: '/admin/projects' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 font-bold text-xl text-blue-600 flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex-shrink-0"></div>
          {isSidebarOpen && <span>AdminPanel</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className="flex items-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
              {item.icon}
              {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <HiOutlineLogout size={22}/>
            {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <HiOutlineMenuAlt2 size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> {/* මෙතනට තමයි ඔයාගේ අනිත් pages ලෝඩ් වෙන්නේ */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;