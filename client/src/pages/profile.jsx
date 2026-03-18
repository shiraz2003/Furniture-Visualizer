import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { FaChair, FaUserCircle, FaHistory, FaDraftingCompass, FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';
import { MdOutlineChair, MdOutlineBedroomParent } from 'react-icons/md';
import { PiArmchairFill, PiWall } from 'react-icons/pi';
import { TfiMoney } from 'react-icons/tfi';
import { TbTax } from 'react-icons/tb';
import api from '../services/api.js';
import { useDesign } from '../context/DesignContext.jsx';

export default function Profile() {
    const [userProfile, setUserProfile] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Order management state
    const [userOrders, setUserOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 2;
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState('');

    // Saved designs state
    const [userDesigns, setUserDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(false);
    const [designsCurrentPage, setDesignsCurrentPage] = useState(1);
    const DESIGNS_PER_PAGE = 2;

    const { setRoom, setItems, setDesignName } = useDesign();

    // Fetch user profile and orders on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);
    
    // Fetch orders + designs when user profile is loaded
    useEffect(() => {
        if (userProfile.email) {
            fetchUserOrders();
            fetchUserDesigns();
        }
    }, [userProfile.email]);

    // Filter orders based on search criteria
    useEffect(() => {
        let filtered = userOrders;

        if (searchTerm) {
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())
                ) ||
                order.notes?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedStatus) {
            filtered = filtered.filter(order => 
                order.status.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        if (selectedDateRange) {
            const today = new Date();
            const filterDate = new Date(today);
            
            switch (selectedDateRange) {
                case 'last7days': filterDate.setDate(today.getDate() - 7); break;
                case 'last30days': filterDate.setDate(today.getDate() - 30); break;
                case 'last3months': filterDate.setMonth(today.getMonth() - 3); break;
                default: filterDate.setFullYear(today.getFullYear() - 10);
            }
        
            filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
        }

        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [userOrders, searchTerm, selectedStatus, selectedDateRange]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/profile',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUserProfile({
                firstname: response.data.firstname || '',
                lastname: response.data.lastname || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile information');
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserOrders = async () => {
        try {
            setOrdersLoading(true);
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await axios.get(
                `${apiUrl}/api/admin/orders/customer/${encodeURIComponent(userProfile.email)}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUserOrders(response.data.data.orders || []);
            setFilteredOrders(response.data.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load order history');
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchUserDesigns = async () => {
        try {
            setDesignsLoading(true);
            const res = await api.get('/designs');
            setUserDesigns(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching designs:', err);
            setError(prev => prev || 'Failed to load saved designs');
        } finally {
            setDesignsLoading(false);
        }
    };

    const loadDesignInViewer = (design) => {
        setDesignName(design?.name || 'My Design');
        setRoom(design?.room);
        setItems(Array.isArray(design?.items) ? design.items : []);
        window.location.href = '/viewer-3d';
    };

    const getOrderStatuses = () => {
        const statuses = userOrders.map(order => order.status).filter(Boolean);
        return [...new Set(statuses)];
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedDateRange('');
        setCurrentPage(1);
    };

    // Updated status colors to match your theme
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-[#dedcff] text-[#2f27ce] border-[#433bff]/20',
            confirmed: 'bg-[#433bff]/10 text-[#433bff] border-[#433bff]/30',
            processing: 'bg-[#2f27ce]/10 text-[#2f27ce] border-[#2f27ce]/30',
            shipping: 'bg-[#dedcff] text-[#433bff] border-[#dedcff]',
            delivered: 'bg-[#050315]/10 text-[#050315] border-[#050315]/20',
            cancelled: 'bg-rose-100 text-rose-800 border-rose-200' // kept red for cancellation alert
        };
        return colors[status] || 'bg-[#fbfbfe] text-[#050315] border-[#dedcff]';
    };

    // Pagination helper
    const getPaginationData = () => {
        const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
        return { totalPages, paginatedOrders, startIndex, endIndex };
    };

    // Pagination helper for designs
    const getDesignsPaginationData = () => {
        const totalPages = Math.ceil(userDesigns.length / DESIGNS_PER_PAGE);
        const startIndex = (designsCurrentPage - 1) * DESIGNS_PER_PAGE;
        const endIndex = startIndex + DESIGNS_PER_PAGE;
        const paginatedDesigns = userDesigns.slice(startIndex, endIndex);
        return { totalPages, paginatedDesigns };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        const { firstname, lastname, email, phone } = userProfile;
        if (!firstname || !lastname || !email || !phone) {
            setError('Please fill in all required fields');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (at least 10 digits)');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            setSaving(true);
            setError('');
            setSuccessMessage('');
            const response = await axios.put(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/profile', 
                userProfile,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            if (response.data.user) {
                setUserProfile({
                    firstname: response.data.user.firstname || '',
                    lastname: response.data.user.lastname || '',
                    email: response.data.user.email || '',
                    phone: response.data.user.phone || '',
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccessMessage('');
        fetchUserProfile();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfe] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-[#fbfbfe]">
            <Navbar />
            
            <div className="pt-32 pb-20 container mx-auto px-6 max-w-7xl">
                
                {/* Profile Hero Section */}
                <div className="relative mb-12 bg-[#2f27ce] rounded-[2rem] p-8 md:p-12 text-[#fbfbfe] overflow-hidden shadow-2xl shadow-[#2f27ce]/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#433bff] opacity-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-[#fbfbfe]/10 backdrop-blur-md rounded-full flex items-center justify-center border border-[#dedcff]/20 shadow-inner">
                            <FaUserCircle size={80} className="text-[#dedcff]" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-[#fbfbfe]">
                                Hello, {userProfile.firstname || 'User'}!
                            </h1>
                            <p className="text-[#dedcff] font-medium opacity-90 uppercase tracking-widest text-sm">
                                Manage your account & orders
                            </p>
                        </div>
                    </div>
                </div>

                {error && <div className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 font-medium">{error}</div>}
                {successMessage && <div className="mb-8 p-5 bg-[#dedcff] text-[#2f27ce] rounded-2xl border border-[#433bff]/20 font-medium">{successMessage}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Column: Personal Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#050315]/5 border border-[#dedcff]/50">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#dedcff]/50">
                                <h2 className="text-xl font-black flex items-center gap-3 text-[#050315]">
                                    <FaUserCircle className="text-[#433bff]" /> Profile Details
                                </h2>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#2f27ce] bg-[#dedcff] px-4 py-2 rounded-full hover:bg-[#433bff] hover:text-[#fbfbfe] transition-colors">
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: 'First Name', name: 'firstname', type: 'text' },
                                    { label: 'Last Name', name: 'lastname', type: 'text' },
                                    { label: 'Email Address', name: 'email', type: 'email' },
                                    { label: 'Phone Number', name: 'phone', type: 'tel' }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="text-[11px] font-black text-[#050315]/50 uppercase tracking-widest mb-2 block ml-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={userProfile[field.name]}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all font-bold text-sm outline-none ${!isEditing ? 'bg-[#fbfbfe] border-transparent text-[#050315]/70 cursor-not-allowed' : 'bg-white border-[#dedcff] text-[#050315] focus:border-[#2f27ce] focus:ring-4 focus:ring-[#dedcff]/50'}`}
                                        />
                                    </div>
                                ))}
                                {isEditing && (
                                    <div className="flex gap-4 pt-6">
                                        <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 bg-[#2f27ce] text-[#fbfbfe] font-bold rounded-xl shadow-lg shadow-[#2f27ce]/30 hover:bg-[#433bff] active:scale-95 transition-all">
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button onClick={handleCancel} className="flex-1 py-3.5 bg-white text-[#050315] border-2 border-[#dedcff] font-bold rounded-xl hover:bg-[#fbfbfe] transition-all">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Orders & Designs */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Order History */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#050315]/5 border border-[#dedcff]/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#dedcff]/50">
                                <h2 className="text-xl font-black flex items-center gap-3 text-[#050315]">
                                    <FaHistory className="text-[#433bff]" /> Order History
                                </h2>
                                <span className="px-4 py-1.5 bg-[#dedcff] text-[#2f27ce] text-xs font-bold rounded-full">
                                    {filteredOrders.length} Orders
                                </span>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="relative col-span-1 md:col-span-2">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050315]/30" />
                                    <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                                        className="w-full pl-11 pr-4 py-3 bg-[#fbfbfe] text-[#050315] rounded-xl border-2 border-transparent focus:border-[#dedcff] text-sm font-medium outline-none transition-all placeholder:text-[#050315]/40" />
                                </div>
                                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} 
                                    className="w-full px-4 py-3 bg-[#fbfbfe] text-[#050315] rounded-xl border-2 border-transparent focus:border-[#dedcff] text-sm font-medium outline-none cursor-pointer">
                                    <option value="">All Statuses</option>
                                    {getOrderStatuses().map((status) => (
                                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                    ))}
                                </select>
                                <button onClick={clearFilters} className="w-full px-4 py-3 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-xl hover:bg-[#fbfbfe] transition-all text-sm">
                                    Clear
                                </button>
                            </div>

                            {/* Orders List */}
                            {ordersLoading ? (
                                <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-32 bg-[#fbfbfe] rounded-2xl animate-pulse"></div>)}</div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-16 bg-[#fbfbfe] rounded-2xl border-2 border-dashed border-[#dedcff]">
                                    <p className="text-[#050315]/40 font-bold uppercase text-xs tracking-widest">No orders found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6 mb-8">
                                        {getPaginationData().paginatedOrders.map(order => (
                                            <div key={order._id} className="p-2 bg-white rounded-xl border-2 border-[#dedcff]/50 hover:border-[#433bff]/50 transition-all shadow-sm">
                                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-[#dedcff]/30">
                                                    <div>
                                                        <p className="text-[10px] font-black text-[#050315]/40 uppercase tracking-widest mb-1">Order ID</p>
                                                        <h4 className="text-lg font-black text-[#050315]">#{order._id.slice(-8).toUpperCase()}</h4>
                                                    </div>
                                                    <div className="flex flex-col md:items-end">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>{order.status}</span>
                                                        <p className="text-[10px] text-[#050315]/50 mt-2 font-bold uppercase">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#fbfbfe] rounded-xl border border-[#dedcff]/50">
                                                    <div><p className="text-[9px] font-black text-[#050315]/40 uppercase mb-1">Items</p><p className="font-black text-sm text-[#050315]">{order.items.length}</p></div>
                                                    <div><p className="text-[9px] font-black text-[#050315]/40 uppercase mb-1">Total</p><p className="font-black text-lg text-[#2f27ce]">Rs.{order.pricing.total.toFixed(2)}</p></div>
                                                    <div><p className="text-[9px] font-black text-[#050315]/40 uppercase mb-1">Tax</p><p className="font-black text-sm text-[#050315]/60">Rs.{order.pricing.tax.toFixed(2)}</p></div>
                                                    <div><p className="text-[9px] font-black text-[#050315]/40 uppercase mb-1">Room</p><p className="font-black text-xs text-[#050315]">{order.roomSetup.width}x{order.roomSetup.length}m</p></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {getPaginationData().totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#dedcff]/50">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                            >
                                                ← Previous
                                            </button>

                                            <div className="flex gap-2">
                                                {Array.from({ length: getPaginationData().totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3.5 py-2 rounded-lg font-bold text-sm transition-all ${
                                                            currentPage === page
                                                                ? 'bg-[#2f27ce] text-[#fbfbfe] shadow-lg shadow-[#2f27ce]/30'
                                                                : 'bg-white border-2 border-[#dedcff] text-[#050315] hover:bg-[#fbfbfe]'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(getPaginationData().totalPages, prev + 1))}
                                                disabled={currentPage === getPaginationData().totalPages}
                                                className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Saved Designs */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#050315]/5 border border-[#dedcff]/50">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#dedcff]/50">
                                <h2 className="text-xl font-black flex items-center gap-3 text-[#050315]">
                                    <FaDraftingCompass className="text-[#433bff]" /> Saved Designs
                                </h2>
                                <span className="px-4 py-1.5 bg-[#dedcff] text-[#2f27ce] text-xs font-bold rounded-full">
                                    {userDesigns.length} Total
                                </span>
                            </div>

                            {designsLoading ? (
                                <div className="h-40 flex items-center justify-center animate-pulse text-[#433bff]">Loading Designs...</div>
                            ) : userDesigns.length === 0 ? (
                                <div className="text-center py-16 bg-[#fbfbfe] rounded-2xl border-2 border-dashed border-[#dedcff]">
                                    <PiWall size={40} className="mx-auto text-[#050315]/20 mb-3" />
                                    <p className="text-[#050315]/40 font-bold uppercase text-xs tracking-widest">No designs saved yet</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                        {getDesignsPaginationData().paginatedDesigns.map(design => (
                                            <div key={design._id} className="group bg-[#fbfbfe] rounded-2xl overflow-hidden border border-[#dedcff] transition-all hover:shadow-lg hover:border-[#433bff]/50">
                                                <div className="relative h-48 bg-white border-b border-[#dedcff]">
                                                    {design.thumbnail ? <img src={design.thumbnail} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[#050315]/10"><PiArmchairFill size={60} /></div>}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-black text-lg text-[#050315] truncate mb-1">{design.name || 'Untitled Design'}</h3>
                                                    <p className="text-xs text-[#050315]/50 font-medium mb-4">{new Date(design.createdAt).toLocaleDateString()}</p>
                                                    <button onClick={() => loadDesignInViewer(design)} className="w-full py-3 bg-white border-2 border-[#2f27ce] text-[#2f27ce] font-bold rounded-xl hover:bg-[#2f27ce] hover:text-[#fbfbfe] transition-all active:scale-95">
                                                        Open 3D Viewer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Designs Pagination Controls */}
                                    {getDesignsPaginationData().totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#dedcff]/50">
                                            <button
                                                onClick={() => setDesignsCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={designsCurrentPage === 1}
                                                className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                            >
                                                ← Previous
                                            </button>

                                            <div className="flex gap-2">
                                                {Array.from({ length: getDesignsPaginationData().totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setDesignsCurrentPage(page)}
                                                        className={`px-3.5 py-2 rounded-lg font-bold text-sm transition-all ${
                                                            designsCurrentPage === page
                                                                ? 'bg-[#2f27ce] text-[#fbfbfe] shadow-lg shadow-[#2f27ce]/30'
                                                                : 'bg-white border-2 border-[#dedcff] text-[#050315] hover:bg-[#fbfbfe]'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setDesignsCurrentPage(prev => Math.min(getDesignsPaginationData().totalPages, prev + 1))}
                                                disabled={designsCurrentPage === getDesignsPaginationData().totalPages}
                                                className="px-4 py-2 bg-white border-2 border-[#dedcff] text-[#050315] font-bold rounded-lg hover:bg-[#fbfbfe] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}