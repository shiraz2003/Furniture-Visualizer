import React, { useState } from 'react';
import { HiOutlineUserAdd, HiOutlineTrash, HiOutlineX, HiOutlineExclamationCircle, HiOutlineClock, HiPlus, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const [users, setUsers] = useState([
    { id: 1, name: "Adithya Semina", email: "semina@gmail.com", addedTime: "2/20/2024, 10:30 AM" },
    { id: 2, name: "Test User", email: "test@gmail.com", addedTime: "2/21/2024, 02:15 PM" },
  ]);

  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', password: '', confirmPassword: ''
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  // Step 1: Open Confirmation instead of direct adding
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");
    setShowConfirmModal(true);
  };

  // Step 2: Finalizing addition after confirmation
  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      addedTime: getCurrentDateTime()
    };
    setUsers([...users, newUser]);
    toast.success("User added!");
    setShowConfirmModal(false);
    setShowAddModal(false);
    setFormData({ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' });
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    toast.success("Account removed!");
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="relative min-h-full pb-24 lg:pb-0">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">User Management</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage system access and accounts.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium"
        >
          <HiOutlineUserAdd size={20} /> Add New User
        </button>
      </div>

      {/* --- Mobile Floating Action Button (FAB) --- */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] active:scale-90 transition-transform border-2 border-white"
      >
        <HiPlus size={28} />
      </button>

      {/* 1. Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">User</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Added Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-700">{user.name}</td>
                <td className="p-4 text-sm text-slate-500">{user.email}</td>
                <td className="p-4">
                  <div className="flex items-center text-slate-500 text-sm">
                    <HiOutlineClock className="mr-2 text-indigo-400" />
                    {user.addedTime}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map(user => (
          <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <HiOutlineUser size={20}/>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{user.name}</h4>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <HiOutlineMail /> {user.email}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                className="p-2 text-red-500 bg-red-50 rounded-lg"
              >
                <HiOutlineTrash size={18} />
              </button>
            </div>
            <div className="pt-3 border-t border-slate-50 flex items-center text-[11px] text-slate-400">
              <HiOutlineClock className="mr-1" /> Added on: {user.addedTime}
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Create New Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><HiOutlineX size={20} /></button>
            </div>
            <form onSubmit={handleSubmitClick} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" name="firstname" required placeholder="First Name" onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
                <input type="text" name="lastname" required placeholder="Last Name" onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              </div>
              <input type="email" name="email" required placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              <input type="password" name="password" required placeholder="Password" onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              <input type="password" name="confirmPassword" required placeholder="Confirm Password" onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors">Create User</button>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM ADD MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineUserAdd size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Confirm Creation</h3>
            <p className="text-slate-500 my-3 text-sm">Create a new system account for <b>{formData.firstname}</b>?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleAddUser} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <HiOutlineExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Confirm Delete</h3>
            <p className="text-slate-500 my-3 text-sm">Delete <b>{userToDelete?.name}</b>'s account?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;