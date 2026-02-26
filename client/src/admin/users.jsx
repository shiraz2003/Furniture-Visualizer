import React, { useState, useEffect } from 'react'; 
import { HiOutlineUserAdd, HiOutlineTrash, HiOutlineX, HiOutlineExclamationCircle, HiOutlineClock, HiPlus, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios'; 

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState([]); 

  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', password: '', confirmPassword: ''
  });

  const currentUserName = localStorage.getItem('userName');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      const formattedUsers = response.data.map(u => ({
        id: u._id,
        name: `${u.firstname} ${u.lastname}`,
        email: u.email,
        role: u.role, 
        addedTime: new Date(u.createdAt).toLocaleString()
      }));

      const sortedUsers = formattedUsers.sort((a, b) => {
        if (a.name === currentUserName) return -1;
        if (b.name === currentUserName) return 1;
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");
    setShowConfirmModal(true);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/users', formData);
      toast.success("User added successfully!");
      fetchUsers(); 
      setShowConfirmModal(false);
      setShowAddModal(false);
      setFormData({ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userToDelete.id}`);
      toast.success("Account removed!");
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="relative min-h-full pb-24 lg:pb-0 animate-in fade-in duration-500">
      {/* Header Section */}
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

      {/* Mobile FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] active:scale-90 transition-transform border-2 border-white"
      >
        <HiPlus size={28} />
      </button>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">User</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Email Address</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Registration Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-sm`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${user.role === 'admin' ? 'text-black' : 'text-slate-700'}`}>{user.name}</span>
                      {user.name === currentUserName ? (
                        <span className="text-[10px] bg-green-500 mt-1 text-white px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-tighter">You</span>
                      ) : user.role === 'admin' ? (
                        <span className="text-[10px] bg-indigo-600 mt-1 text-white px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-tighter">Admin</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-500 font-medium">{user.email}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-slate-500 text-sm">
                    <HiOutlineClock className="mr-2 text-indigo-400" />
                    {user.addedTime}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button 
                    disabled={user.role === 'admin'}
                    onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                    className={`p-2 rounded-lg transition-all ${user.role === 'admin' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-400">No users found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map(user => (
          <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-indigo-50  text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm`}>
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${user.role === 'admin' ? 'text-black' : 'text-slate-800'}`}>{user.name}</h4>
                    {user.name === currentUserName ? (
                      <span className="text-[9px] bg-green-500 text-white px-1 py-0.5 rounded font-semibold uppercase tracking-tighter">You</span>
                    ) : user.role === 'admin' ? (
                      <span className="text-[9px] bg-indigo-600 text-white px-1 py-0.5 rounded font-seminbold uppercase tracking-tighter">Admin</span>
                    ) : null}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <HiOutlineMail /> {user.email}
                  </div>
                </div>
              </div>
              <button 
                disabled={user.role === 'admin'}
                onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                className={`p-2 rounded-lg ${user.role === 'admin' ? 'text-slate-200' : 'text-red-500 bg-red-50'}`}
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

      {/* --- MODALS --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleSubmitClick} className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Create New Account</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Personal Details</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="firstname" value={formData.firstname} required placeholder="First Name" onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
                  <input type="text" name="lastname" value={formData.lastname} required placeholder="Last Name" onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
                </div>
                <input type="email" name="email" value={formData.email} required placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="password" name="password" value={formData.password} required placeholder="Password" onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} required placeholder="Confirm Password" onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-4 active:scale-95">
                Create User Account
              </button>
            </div>
          </form>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiPlus size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Confirm Creation</h3>
            <p className="text-slate-500 my-3 text-sm">Create a new system account for <b>{formData.firstname}</b>?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleAddUser} disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 disabled:opacity-50">
                {loading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

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