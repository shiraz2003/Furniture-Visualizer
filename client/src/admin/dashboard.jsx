import React from 'react';
import { 
  HiOutlineUsers, 
  HiOutlineCube, 
  HiOutlineClock 
} from 'react-icons/hi';

const AdminDashboard = () => {
  // Stats data array
  const stats = [
    { 
      label: 'Total Users', 
      value: '24', 
      icon: <HiOutlineUsers size={28} />, 
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-100'
    },
    { 
      label: 'Total Items', 
      value: '142', 
      icon: <HiOutlineCube size={28} />, 
      color: 'from-violet-600 to-purple-600',
      shadow: 'shadow-purple-100'
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section - Header sizes match with Users Page */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl text-white shadow-xl ${stat.shadow} relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Background Decorative Icon */}
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              {React.cloneElement(stat.icon, { size: 110 })}
            </div>
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shrink-0">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium opacity-80 uppercase tracking-widest">{stat.label}</h3>
                <p className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <HiOutlineClock className="text-indigo-600" size={24} />
              Recent Updates
            </h3>
            <button className="text-indigo-600 text-xs font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-5 items-start group">
                {/* Timeline Dot & Line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50 group-hover:bg-indigo-600 transition-colors"></div>
                  {i !== 3 && <div className="w-0.5 h-12 bg-slate-100 mt-2"></div>}
                </div>
                
                <div className="pb-2">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    New furniture item "Minimalist Chair" added to the catalog.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Inventory</span>
                    <span className="text-[11px] text-slate-400 font-medium italic">2 hours ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info (Optional/Placeholder Card to balance layout) */}
        <div className="bg-slate-50 rounded-[2rem] border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
               <HiOutlineCube size={32} />
            </div>
            <h4 className="font-bold text-slate-800">More Insights coming soon</h4>
            <p className="text-sm text-slate-500 mt-2 max-w-[250px]">
              We are working on detailed analytics for your furniture items.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;