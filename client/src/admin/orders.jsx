import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders?limit=1000`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const allOrders = res.data?.data?.orders || [];
      const completedOrders = allOrders.filter(order => order.status === 'completed');
      
      setOrders(completedOrders);

    } catch (err) { 
      console.error("Order Fetch Error:", err);
      toast.error("Failed to load completed orders"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const filteredOrders = orders.filter(order => {
    const customerName = (order.customer?.name || order.customer?.firstname || '').toLowerCase();
    const orderId = (order._id || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    
    return customerName.includes(search) || orderId.includes(search);
  });

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Completed Orders <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full">{orders.length}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">View all successfully delivered and completed orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Customer..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all shadow-sm" 
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
           <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Items</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Total Price</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-700">
                        <span className="text-slate-400">#</span>{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <HiOutlineUser size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">
                                {order.customer?.name || order.customer?.firstname || 'Guest User'}
                            </p>
                            <p className="text-xs text-slate-500">{order.customer?.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                          {order.items?.length || 0} Items
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                          {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600">
                        Rs. {order.pricing?.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <HiOutlineCheckCircle size={14} /> Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 text-sm font-medium">No completed orders found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                <div key={order._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                        <h4 className="font-bold text-slate-800">#{order._id.slice(-8).toUpperCase()}</h4>
                    </div>
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[9px] font-black uppercase">
                        <HiOutlineCheckCircle /> Completed
                    </span>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <HiOutlineUser className="text-slate-400" size={16} />
                            <span className="font-semibold text-slate-700">
                                {order.customer?.name || order.customer?.firstname || 'Guest User'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <HiOutlineShoppingBag className="text-slate-400" size={16} />
                            <span className="font-medium text-slate-500">{order.items?.length || 0} Items ordered</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <HiOutlineCurrencyDollar className="text-emerald-500" size={18} />
                            <span className="font-black text-emerald-600 text-base">
                                Rs. {order.pricing?.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm font-medium">
                    No completed orders found.
                </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;