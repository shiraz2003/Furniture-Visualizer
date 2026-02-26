import React, { useState } from 'react';
import { 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineSearch, 
  HiOutlineTrash, 
  HiOutlineExclamationCircle, 
  HiOutlineX,
  HiOutlineCheck,
  HiChevronDown,
  HiChevronUp
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  
  // View More States
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  // --- Dummy Data (6 each as requested) ---
  const [requests, setRequests] = useState([
    { id: '1', userName: 'John Doe', item: 'Modern Sofa', type: 'Repair', status: 'pending', date: '2026-02-25 10:30 AM' },
    { id: '2', userName: 'Jane Smith', item: 'Office Chair', type: 'Customization', status: 'pending', date: '2026-02-26 02:15 PM' },
    { id: '3', userName: 'Amal Perera', item: 'Wooden Table', type: 'Refurbish', status: 'pending', date: '2026-02-26 04:00 PM' },
    { id: '4', userName: 'Kasun Kalhara', item: 'Luxury Bed', type: 'Repair', status: 'pending', date: '2026-02-27 08:30 AM' },
    { id: '5', userName: 'Ruwan Silva', item: 'Gaming Desk', type: 'Delivery', status: 'pending', date: '2026-02-27 09:15 AM' },
    { id: '6', userName: 'Nuwan Thilaka', item: 'Dining Set', type: 'Customization', status: 'pending', date: '2026-02-27 11:00 AM' },
    
    { id: '101', userName: 'Saman Kumara', item: 'Wardrobe', type: 'Delivery', status: 'completed', date: '2026-02-20 09:00 AM' },
    { id: '102', userName: 'Nimali Silva', item: 'Side Table', type: 'Repair', status: 'completed', date: '2026-02-21 01:45 PM' },
    { id: '103', userName: 'Sunil Perera', item: 'Coffee Table', type: 'Customization', status: 'completed', date: '2026-02-22 11:20 AM' },
    { id: '104', userName: 'Kanthi de Silva', item: 'Bookshelf', type: 'Refurbish', status: 'completed', date: '2026-02-23 03:10 PM' },
    { id: '105', userName: 'Upul Rohana', item: 'Recliner', type: 'Repair', status: 'completed', date: '2026-02-24 10:00 AM' },
    { id: '106', userName: 'Kamal Gunaratne', item: 'TV Stand', type: 'Delivery', status: 'completed', date: '2026-02-25 05:30 PM' },
  ]);

  const handleStatusChange = () => {
    setRequests(requests.map(req => 
      req.id === selectedReq.id ? { ...req, status: 'completed' } : req
    ));
    toast.success("Request marked as completed!");
    setShowCompleteModal(false);
  };

  const handleDelete = () => {
    setRequests(requests.filter(req => req.id !== selectedReq.id));
    toast.success("Request removed!");
    setShowDeleteModal(false);
  };

  const filteredRequests = requests.filter(req => 
    req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const completedRequests = filteredRequests.filter(req => req.status === 'completed');

  // Display Slicing Logic
  const displayedPending = showAllPending ? pendingRequests : pendingRequests.slice(0, 3);
  const displayedCompleted = showAllCompleted ? completedRequests : completedRequests.slice(0, 5);

  const RequestTable = ({ data, title, isPending, showAll, setShowAll, originalCount, limit }) => (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-slate-700 mb-4 ml-1 flex items-center gap-2">
        {isPending ? <HiOutlineClock className="text-amber-500" /> : <HiOutlineCheckCircle className="text-emerald-500" />}
        {title} <span className="text-sm font-medium text-slate-400">({originalCount})</span>
      </h3>
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">User</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Furniture Item</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Request Type</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date & Time</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? data.map(req => (
              <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-sm">{req.userName}</td>
                <td className="p-4 text-sm text-slate-600">{req.item}</td>
                <td className="p-4">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                    {req.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{req.date}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {isPending && (
                      <button 
                        onClick={() => { setSelectedReq(req); setShowCompleteModal(true); }}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <HiOutlineCheck size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => { setSelectedReq(req); setShowDeleteModal(true); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-400 text-sm">No {title.toLowerCase()} found.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {originalCount > limit && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 bg-slate-50 border-t border-slate-100 text-indigo-600 text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-1"
          >
            {showAll ? (
              <><HiChevronUp size={16} /> Show Less</>
            ) : (
              <><HiChevronDown size={16} /> View More ({originalCount - limit} more)</>
            )}
          </button>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map(req => (
          <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800">{req.userName}</h4>
                <p className="text-sm text-indigo-600 font-medium">{req.item}</p>
              </div>
              <div className="flex gap-2">
                {isPending && (
                  <button onClick={() => { setSelectedReq(req); setShowCompleteModal(true); }} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><HiOutlineCheck /></button>
                )}
                <button onClick={() => { setSelectedReq(req); setShowDeleteModal(true); }} className="p-2 text-red-500 bg-red-50 rounded-lg"><HiOutlineTrash /></button>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50 text-[11px]">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">{req.type}</span>
              <span className="text-slate-400 flex items-center gap-1"><HiOutlineClock /> {req.date}</span>
            </div>
          </div>
        ))}
        {originalCount > limit && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="py-2 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1"
          >
            {showAll ? 'Show Less' : `View All (${originalCount})`}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Service Requests</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage and track user furniture requests.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      <RequestTable 
        data={displayedPending} 
        title="Pending Requests" 
        isPending={true} 
        showAll={showAllPending}
        setShowAll={setShowAllPending}
        originalCount={pendingRequests.length}
        limit={3}
      />
      
      <RequestTable 
        data={displayedCompleted} 
        title="Completed Requests" 
        isPending={false} 
        showAll={showAllCompleted}
        setShowAll={setShowAllCompleted}
        originalCount={completedRequests.length}
        limit={5}
      />

      {/* Complete Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCompleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineCheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Mark as Complete?</h3>
            <p className="text-slate-500 my-3 text-sm">Has the request for <b>{selectedReq?.item}</b> been fulfilled?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCompleteModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">No</button>
              <button onClick={handleStatusChange} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg">Yes, Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <HiOutlineExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Remove Request</h3>
            <p className="text-slate-500 my-3 text-sm">Are you sure you want to remove this request?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;