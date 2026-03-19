import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  HiOutlineUsers, 
  HiOutlineCube, 
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineRefresh 
} from 'react-icons/hi';
import axios from 'axios'; 

const AdminDashboard = () => {
  const [showAll, setShowAll] = useState(false);
  const [userCount, setUserCount] = useState('0'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [totalOrdersCount, setTotalOrdersCount] = useState('0');
  const [totalRevenue, setTotalRevenue] = useState('0.00');
  
  const [currentAdminName, setCurrentAdminName] = useState('Admin');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.firstname) {
          setCurrentAdminName(`${response.data.firstname} ${response.data.lastname || ''}`.trim());
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Users
      try {
        const userRes = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/admin/users', { headers });
        setUserCount(userRes.data.length.toString());
      } catch(e) { console.error("Users error:", e); }

      // 2. Fetch Items (Furniture)
      try {
        const itemRes = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/furniture/all');
        const sortedItems = itemRes.data.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0);
            const dateB = new Date(b.createdAt || b.updatedAt || 0);
            return dateB - dateA; 
        });
        setItems(sortedItems);
      } catch(e) { console.error("Items error:", e); }

      // 3. Fetch Orders & Revenue
      try {
          const orderRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders?limit=1000`, { headers });
          
          let allOrders = [];
          if (orderRes.data && orderRes.data.data && Array.isArray(orderRes.data.data.orders)) {
              allOrders = orderRes.data.data.orders; 
          } else if (orderRes.data && Array.isArray(orderRes.data.data)) {
              allOrders = orderRes.data.data; 
          } else if (Array.isArray(orderRes.data)) {
              allOrders = orderRes.data;
          }
          
          const completedOrders = allOrders.filter(order => order.status === 'completed');
          
          setTotalOrdersCount(completedOrders.length.toString());
          
          const revenue = completedOrders.reduce((sum, order) => {
              const price = order.pricing?.total || 0;
              return sum + price;
          }, 0);
          
          setTotalRevenue(revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } catch (orderErr) {
          console.error("Error fetching order stats:", orderErr);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleItemAdded = () => {
        fetchDashboardData();
    };

    window.addEventListener('itemAdded', handleItemAdded);

    return () => {
        window.removeEventListener('itemAdded', handleItemAdded);
    };
  }, [fetchDashboardData]);

  const stats = [
    { 
      label: 'Total Users', 
      value: userCount, 
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
    { 
      label: 'Completed Orders', 
      value: totalOrdersCount, 
      icon: <HiOutlineShoppingBag size={28} />, 
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-teal-100'
    },
    { 
      label: 'Total Revenue', 
      value: `Rs. ${totalRevenue}`, 
      icon: <HiOutlineCurrencyDollar size={28} />, 
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-orange-100'
    },
  ];

  const displayItems = showAll ? items : items.slice(0, 3);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 sm:mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Welcome back, {currentAdminName}! Here's what's happening today.</p>
        </div>
        
        {/* 💡 වෙනස් කළ Refresh Button එක */}
        <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm focus:outline-none"
            title="Refresh Data"
        >
            <HiOutlineRefresh className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl text-white shadow-xl ${stat.shadow} relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              {React.cloneElement(stat.icon, { size: 110 })}
            </div>
            
            <div className="relative z-10 flex items-start flex-col gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md w-fit">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className={`${stat.label === 'Total Revenue' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-bold tracking-tight truncate`}>
                    {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 relative">
          
          {loading && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
                 <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <HiOutlineClock className="text-indigo-600" size={24} />
              Recent Updates
            </h3>
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-600 text-xs font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
            >
              {showAll ? 'Show Less' : 'View All'} 
            </button>
          </div>
          
          <div className="space-y-6">
            {displayItems.length > 0 ? displayItems.map((item, index) => (
              <div key={item._id || index} className="flex gap-5 items-start group animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50 group-hover:bg-indigo-600 transition-colors"></div>
                  {index !== displayItems.length - 1 && <div className="w-0.5 h-12 bg-slate-100 mt-2"></div>}
                </div>
                
                <div className="pb-2 w-full">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    New furniture item <span className="text-indigo-600">"{item.name}"</span> added to the catalog by <span className="font-bold text-slate-900">{item.addedBy || item.author || currentAdminName}</span>.
                  </p>
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium italic">
                            {formatTimeAgo(item.createdAt || item.updatedAt)}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 text-sm py-4">No items available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;