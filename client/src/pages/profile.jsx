import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { FaChair } from 'react-icons/fa';
import { MdOutlineChair } from 'react-icons/md';
import { PiArmchairFill } from 'react-icons/pi';
import { TfiMoney } from 'react-icons/tfi';
import { TbTax } from 'react-icons/tb';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { PiWall } from 'react-icons/pi';
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
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState('');

    // Saved designs state
    const [userDesigns, setUserDesigns] = useState([]);
    const [designsLoading, setDesignsLoading] = useState(false);

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
                case 'last7days':
                    filterDate.setDate(today.getDate() - 7);
                    break;
                case 'last30days':
                    filterDate.setDate(today.getDate() - 30);
                    break;
                case 'last3months':
                    filterDate.setMonth(today.getMonth() - 3);
                    break;
                default:
                    filterDate.setFullYear(today.getFullYear() - 10); // Show all
            }
        
            filtered = filtered.filter(order => 
                new Date(order.orderDate) >= filterDate
            );
        }

        setFilteredOrders(filtered);
    }, [userOrders, searchTerm, selectedStatus, selectedDateRange]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + '/api/auth/profile',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
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
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
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
            // don't clear a profile error if one already set; only clear design-specific errors

            const res = await api.get('/designs');
            setUserDesigns(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching designs:', err);
            // don't override more important errors (like profile load)
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

    // Get unique statuses for filter dropdown
    const getOrderStatuses = () => {
        const statuses = userOrders.map(order => order.status).filter(Boolean);
        return [...new Set(statuses)];
    };

    // Clear all search and filter criteria
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedDateRange('');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            processing: 'bg-purple-100 text-purple-800 border-purple-200',
            shipping: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
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
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            
            // Update profile with response data
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
        fetchUserProfile(); // Reset to original values
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <Navbar />
        
        <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto scrollbar-hide">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">User Dashboard</h1>
                    <p className="text-gray-600">Manage your account and view order history</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600">{successMessage}</p>
                    </div>
                )}

                <div className="space-y-8">
                    
                    {/* Profile Information Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200">
                        {/* Profile Header */}
                        <div className="bg-blue-600 px-6 py-4 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={userProfile.firstname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={userProfile.lastname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userProfile.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userProfile.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Order History Section */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200">
                        {/* Order History Header */}
                        <div className="bg-green-800 px-6 py-4 rounded-t-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-bold text-white">Order History</h2>
                                <div className="text-sm text-white/90">
                                    Total: {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} | 
                                    Showing: {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Search Orders</label>
                                    <input
                                        type="text"
                                        placeholder="Order ID, item name, category..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Order Status Filter */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Order Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Statuses</option>
                                        {getOrderStatuses().map((status) => (
                                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range Filter */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Date Range</label>
                                    <select
                                        value={selectedDateRange}
                                        onChange={(e) => setSelectedDateRange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Time</option>
                                        <option value="last7days">Last 7 Days</option>
                                        <option value="last30days">Last 30 Days</option>
                                        <option value="last3months">Last 3 Months</option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 invisible">Clear</label>
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Orders Display */}
                        <div className="p-6">
                            {ordersLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading orders...</span>
                                </div>
                            ) : filteredOrders.length === 0 && userOrders.length > 0 ? (
                                <div className="text-center py-12">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders match your search criteria</h3>
                                        <p className="text-gray-600 mb-6">Try adjusting your search terms or clear the filters</p>
                                        <button 
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            ) : userOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                                        <svg fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                                            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                    <p className="text-gray-600 mb-4">You haven't placed any orders yet. Start shopping to see your order history here!</p>
                                    <button
                                        onClick={() => window.location.href = '/furniture'}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredOrders.map((order) => (
                                        <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <MdOutlineChair />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Order Summary Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <PiArmchairFill />
                                                    <div>
                                                        <p className="font-medium">Items</p>
                                                        <p>{order.items.reduce((total, item) => total + item.quantity, 0)} pieces</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <TfiMoney />
                                                    <div>
                                                        <p className="font-medium">Total</p>
                                                        <p className="font-bold text-lg">${order.pricing.total.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <TbTax />
                                                    <div>
                                                        <p className="font-medium">Tax</p>
                                                        <p>${order.pricing.tax.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MdOutlineBedroomParent />
                                                    <div>
                                                        <p className="font-medium">Room Size</p>
                                                        <p>{order.roomSetup.width}×{order.roomSetup.length}×{order.roomSetup.height}m</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Room Setup Info */}
                                            <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                                                <h4 className="text-sm font-medium text-amber-800 mb-2">Room Specifications</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-amber-700">
                                                    <div><span className="font-medium">Size:</span> {order.roomSetup.width}m × {order.roomSetup.length}m × {order.roomSetup.height}m</div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">Wall:</span> 
                                                        <span className="inline-block w-4 h-4 rounded border border-gray-300 ml-1" style={{backgroundColor: order.roomSetup.wallColor}}></span> 
                                                        <span>{order.roomSetup.wallColor}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">Floor:</span> 
                                                        <span className="inline-block w-4 h-4 rounded border border-gray-300 ml-1" style={{backgroundColor: order.roomSetup.floorColor}}></span>
                                                        <span>{order.roomSetup.floorColor}</span>
                                                    </div>
                                                    <div><span className="font-medium">Items:</span> {order.items.reduce((total, item) => total + item.quantity, 0)} pieces</div>
                                                </div>
                                            </div>
                                            
                                            {/* Order Items */}
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Items Ordered</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl">
                                                                    <FaChair />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                                    <p className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block mt-1">{item.category}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                                <p className="text-xs text-gray-600">{item.quantity} × ${item.price.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Order Footer */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end pt-4 border-t border-gray-200 gap-4">
                                                <div className="text-sm text-gray-600">
                                                    {order.notes && (
                                                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                                            <p><span className="font-medium text-blue-800">Notes:</span> <span className="text-blue-700">{order.notes}</span></p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right bg-green-50 p-4 rounded-lg border">
                                                    <p className="text-2xl font-bold text-green-800">${order.pricing.total.toFixed(2)}</p>
                                                    <p className="text-xs text-green-600">Including ${order.pricing.tax.toFixed(2)} tax</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Status: <span className={`font-medium px-2 py-1 rounded ${getStatusColor(order.status).replace('border', 'bg').replace('text-', 'text-')}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Saved Designs */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-indigo-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Saved 3D Designs</h2>
                                    <span className="text-white/90 text-sm">{userDesigns.length} total</span>
                                </div>
                            </div>

                            <div className="p-6">
                                {designsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                        <span className="ml-3 text-gray-600">Loading saved designs...</span>
                                    </div>
                                ) : userDesigns.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <PiWall className="text-3xl" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No saved designs yet</h3>
                                        <p className="text-gray-600 mt-1">Save a design from the 3D viewer to see it here.</p>
                                        <div className="mt-4">
                                            <button
                                                onClick={() => (window.location.href = '/viewer-3d')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Go to 3D Viewer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {userDesigns.map(design => (
                                            <div key={design._id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                                {design.thumbnail ? (
                                                    <img src={design.thumbnail} alt={design.name || 'Design'} className="w-full h-40 object-cover" />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-3xl">
                                                        <PiArmchairFill />
                                                    </div>
                                                )}

                                                <div className="p-4 flex-1 flex flex-col gap-3">
                                                    <div>
                                                        <h3 className="text-base font-semibold text-gray-900 truncate">{design.name || 'My Design'}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {design.createdAt ? new Date(design.createdAt).toLocaleString() : ''}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                                                        <div className="flex items-center gap-2">
                                                            <MdOutlineBedroomParent className="text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">Room</p>
                                                                <p>
                                                                    {design.room?.width ?? '—'}×{design.room?.length ?? '—'}m
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaChair className="text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">Items</p>
                                                                <p>{Array.isArray(design.items) ? design.items.length : 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => loadDesignInViewer(design)}
                                                        className="mt-auto w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Open in 3D Viewer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}