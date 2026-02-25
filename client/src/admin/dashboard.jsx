import React, { useState, useEffect } from 'react'; // useEffect එක් කළා
import { 
  HiOutlineUsers, 
  HiOutlineCube, 
  HiOutlineClock 
} from 'react-icons/hi';
import axios from 'axios'; // axios එක් කළා

const AdminDashboard = () => {
  // --- පවතින Items Array එක ---
  const items = [
    { id: 1, name: "Modern Sofa", category: "Living Room" },
    { id: 2, name: "Office Chair", category: "Office" },
    { id: 3, name: "Wooden Table", category: "Kitchen" },
    { id: 4, name: "Minimalist Chair", category: "Living Room" },
    { id: 5, name: "Luxury Bed", category: "Bedroom" },
    { id: 6, name: "Gaming Desk", category: "Office" },
    { id: 7, name: "Dining Set", category: "Kitchen" },
    { id: 8, name: "Bar Stool", category: "Kitchen" }
  ];

  const [showAll, setShowAll] = useState(false);
  
  // --- අලුතින් එක් කළ State එක (Users ගණන සඳහා) ---
  const [userCount, setUserCount] = useState('...'); 

  // --- Backend එකෙන් ඇත්තම Usersලා ගණන ලබා ගැනීම ---
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        setUserCount(response.data.length.toString());
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserCount('0'); // Error එකක් ආවොත් 0 පෙන්වන්න
      }
    };
    fetchUserCount();
  }, []);

  // Stats data array (Value එක දැන් Dynamic වේ)
  const stats = [
    { 
      label: 'Total Users', 
      value: userCount, // මෙතනට userCount ලබා දුන්නා
      icon: <HiOutlineUsers size={28} />, 
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-100'
    },
    { 
      label: 'Total Items', 
      value: items.length.toString(), 
      icon: <HiOutlineCube size={28} />, 
      color: 'from-violet-600 to-purple-600',
      shadow: 'shadow-purple-100'
    },
  ];

  const displayItems = showAll ? [...items].reverse() : [...items].reverse().slice(0, 3);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl text-white shadow-xl ${stat.shadow} relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
          >
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

      {/* Recent Updates Section - Full Width */}
      <div className="w-full">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <HiOutlineClock className="text-indigo-600" size={24} />
              Recent Updates
            </h3>
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-600 text-xs font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {showAll ? 'Show Less' : 'View All'} 
            </button>
          </div>
          
          <div className="space-y-6">
            {displayItems.map((item, index) => (
              <div key={item.id} className="flex gap-5 items-start group animate-in slide-in-from-top-2 duration-300">
                {/* Timeline Dot & Line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50 group-hover:bg-indigo-600 transition-colors"></div>
                  {index !== displayItems.length - 1 && <div className="w-0.5 h-12 bg-slate-100 mt-2"></div>}
                </div>
                
                <div className="pb-2">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    New furniture item <span className="text-indigo-600">"{item.name}"</span> added to the catalog.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium italic">Just now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;