
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaTrash} from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import Navbar from "../components/Navbar";
import { useDesign } from '../context/DesignContext';
import axios from 'axios';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { room } = useDesign();
    
    // Order form state
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderFormData, setOrderFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        notes: '',
        // Room setup fields
        roomWidth: room.width,
        roomLength: room.length,
        roomHeight: room.height,
        wallColor: room.wallColor,
        floorColor: room.floorColor
    });
    const [submittingOrder, setSubmittingOrder] = useState(false);

    useEffect(() => {
        loadCartItems();
        
        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCartItems();
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const loadCartItems = () => {
        try {
            const items = JSON.parse(localStorage.getItem('furnitureCart')) || [];
            setCartItems(items);
        } catch (error) {
            console.error('Error loading cart:', error);
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const updatedItems = cartItems.map(item => 
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            );
            
            setCartItems(updatedItems);
            localStorage.setItem('furnitureCart', JSON.stringify(updatedItems));
            
            toast.success('Quantity updated');
            // Dispatch event for navbar update
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const handleRemoveItem = (itemId, itemName) => {
        try {
            const updatedItems = cartItems.filter(item => item._id !== itemId);
            setCartItems(updatedItems);
            localStorage.setItem('furnitureCart', JSON.stringify(updatedItems));
            
            toast.success(`${itemName} removed from cart`);
            // Dispatch event for navbar update
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handleClearCart = () => {
        try {
            localStorage.removeItem('furnitureCart');
            setCartItems([]);
            toast.success('Cart cleared successfully');
            // Dispatch event for navbar update
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        setShowOrderForm(true);
    };
    
    const handleOrderFormChange = (e) => {
        const { name, value, type } = e.target;
        setOrderFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!orderFormData.customerName || !orderFormData.email || !orderFormData.phone || !orderFormData.address) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        setSubmittingOrder(true);
        
        try {
            const orderData = {
                customer: {
                    name: orderFormData.customerName,
                    email: orderFormData.email,
                    phone: orderFormData.phone,
                    address: {
                        street: orderFormData.address,
                        city: orderFormData.city,
                        zipCode: orderFormData.zipCode
                    }
                },
                roomSetup: {
                    width: orderFormData.roomWidth,
                    length: orderFormData.roomLength,
                    height: orderFormData.roomHeight,
                    wallColor: orderFormData.wallColor,
                    floorColor: orderFormData.floorColor
                },
                items: cartItems,
                pricing: {
                    subtotal: cartTotal,
                    tax: taxAmount,
                    total: finalTotal
                },
                notes: orderFormData.notes,
                orderDate: new Date().toISOString()
            };
            
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/admin/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Clear cart and form
            localStorage.removeItem('furnitureCart');
            setCartItems([]);
            setOrderFormData({
                customerName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                zipCode: '',
                notes: '',
                roomWidth: room.width,
                roomLength: room.length,
                roomHeight: room.height,
                wallColor: room.wallColor,
                floorColor: room.floorColor
            });
            setShowOrderForm(false);
            
            toast.success('Order submitted successfully! Admin has been notified.');
            window.dispatchEvent(new Event('cartUpdated'));
            
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Failed to submit order. Please try again.');
        } finally {
            setSubmittingOrder(false);
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxAmount = cartTotal * 0.08; // 8% tax
    const finalTotal = cartTotal + taxAmount;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Navbar />
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Navbar />
            
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <FaShoppingCart className="h-6 w-6 text-amber-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Cart</h1>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-600/20 text-amber-400">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="font-medium text-sm px-4 py-2 border border-red-400 text-red-400 rounded-md hover:bg-red-400/10 transition-colors duration-200"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    /* Empty Cart State */
                    <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20">
                        <FaShoppingCart className="h-24 w-24 text-slate-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
                        <p className="text-slate-300 mb-8">Discover our amazing furniture collection!</p>
                        <button
                            onClick={() => navigate('/furniture')}
                            className="font-semibold px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors duration-200 inline-flex items-center gap-2 text-white"
                        >
                            <FaShoppingCart className="h-5 w-5" />
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Cart Items */
                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="xl:w-2/3">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="rounded-lg shadow-md p-4 sm:p-6 border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Product Image */}
                                            <div className="w-full sm:w-32 h-32 flex-shrink-0">
                                                <img
                                                    src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZ1cm5pdHVyZTwvdGV4dD48L3N2Zz4='}
                                                    alt={item.name}
                                                    className="w-full h-32 object-cover rounded-md bg-gray-100" 
                                                    onError={(e) => {
                                                        // Use a simple colored div as final fallback
                                                        e.target.style.display = 'none';
                                                        const fallback = e.target.nextElementSibling;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                                <div 
                                                    style={{ display: 'none' }}
                                                    className="w-full h-32 bg-slate-600 rounded-md flex items-center justify-center text-slate-300 text-sm"
                                                >
                                                    🪑 {item.name || 'Furniture'}
                                                </div>
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                                                            {item.name || 'Unknown Item'}
                                                        </h3>
                                                        <p className="text-sm text-slate-300 mb-2">
                                                            {item.category && <span className="inline-block bg-amber-600/20 text-amber-400 px-2 py-1 rounded mr-2">{item.category}</span>}
                                                        </p>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm text-slate-300">Quantity:</span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                                    title="Decrease quantity"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    value={item.quantity || 1}
                                                                    onChange={(e) => {
                                                                        const qty = parseInt(e.target.value);
                                                                        if (qty >= 1 && qty <= 10) {
                                                                            handleUpdateQuantity(item._id, qty);
                                                                        }
                                                                    }}
                                                                    className="w-16 px-2 py-1 text-center border border-slate-600 bg-slate-700 text-white rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                                    title="Set quantity"
                                                                />
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                                    disabled={item.quantity >= 10}
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                                    title="Increase quantity"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Price and Actions */}
                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold text-green-400">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                            <div className="text-sm text-slate-400">
                                                                ${item.price?.toFixed(2) || '0.00'} × {item.quantity}
                                                            </div>
                                                        </div>
                                                        
                                                        <button
                                                            onClick={() => handleRemoveItem(item._id, item.name)}
                                                            className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors duration-200 flex items-center gap-1"
                                                            title="Remove from cart"
                                                        >
                                                            <FaTrash className="h-4 w-4" />
                                                            <span className="hidden sm:inline text-sm">Remove</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Cart Summary */}
                        <div className="xl:w-1/3">
                            <div className="rounded-lg shadow-md p-6 border border-white/20 bg-white/10 backdrop-blur-md sticky top-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300">Items ({cartItems.length}):</span>
                                        <span className="font-medium text-white">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300">Tax (8%):</span>
                                        <span className="font-medium text-white">${taxAmount.toFixed(2)}</span>
                                    </div>
                                    
                                    <hr className="border-white/20" />
                                    
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span className="text-white">Total:</span>
                                        <span className="text-green-400">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCheckout}
                                    className="w-full text-white font-semibold py-3 px-4 rounded-lg mt-6 bg-amber-600 hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart className="h-5 w-5" />
                                    Place Order
                                </button>
                                
                                <button
                                    onClick={() => navigate('/furniture')}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg mt-3 transition-colors duration-200"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Order Form Modal */}
                {showOrderForm && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                            <h2 className="text-2xl font-bold text-white mb-6">Complete Your Order</h2>
                            
                            {/* Room Setup Summary */}
                            <div className="mb-6 p-4 bg-amber-600/20 rounded-lg border border-amber-600/30">
                                <h3 className="text-lg font-semibold text-amber-400 mb-2">Room Setup Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-slate-300">Dimensions:</span> <span className="text-white">{orderFormData.roomWidth}m × {orderFormData.roomLength}m × {orderFormData.roomHeight}m</span></div>
                                    <div><span className="text-slate-300">Wall Color:</span> <span className="text-white">{orderFormData.wallColor}</span></div>
                                    <div><span className="text-slate-300">Floor Color:</span> <span className="text-white">{orderFormData.floorColor}</span></div>
                                </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                                <h3 className="text-lg font-semibold text-white mb-2">Order Summary</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-300">Items:</span><span className="text-white">${cartTotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-300">Tax:</span><span className="text-white">${taxAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-lg font-semibold"><span className="text-green-400">Total:</span><span className="text-green-400">${finalTotal.toFixed(2)}</span></div>
                                </div>
                            </div>
                            
                            {/* Customer Information Form */}
                            <form onSubmit={handleSubmitOrder} className="space-y-6">
                                {/* Room Setup Fields */}
                                <div className="border border-slate-600 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-white mb-4">Customize Room Setup</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Width (meters)</label>
                                            <input
                                                type="number"
                                                name="roomWidth"
                                                value={orderFormData.roomWidth}
                                                onChange={handleOrderFormChange}
                                                min="1"
                                                max="20"
                                                step="0.1"
                                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                placeholder="Width"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Length (meters)</label>
                                            <input
                                                type="number"
                                                name="roomLength"
                                                value={orderFormData.roomLength}
                                                onChange={handleOrderFormChange}
                                                min="1"
                                                max="20"
                                                step="0.1"
                                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                placeholder="Length"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Height (meters)</label>
                                            <input
                                                type="number"
                                                name="roomHeight"
                                                value={orderFormData.roomHeight}
                                                onChange={handleOrderFormChange}
                                                min="2"
                                                max="5"
                                                step="0.1"
                                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                placeholder="Height"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Wall Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    name="wallColor"
                                                    value={orderFormData.wallColor}
                                                    onChange={handleOrderFormChange}
                                                    className="w-12 h-10 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    name="wallColor"
                                                    value={orderFormData.wallColor}
                                                    onChange={handleOrderFormChange}
                                                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                    placeholder="#ffffff"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Floor Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    name="floorColor"
                                                    value={orderFormData.floorColor}
                                                    onChange={handleOrderFormChange}
                                                    className="w-12 h-10 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    name="floorColor"
                                                    value={orderFormData.floorColor}
                                                    onChange={handleOrderFormChange}
                                                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                    placeholder="#8B4513"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Customer Information */}
                                <div className="border border-slate-600 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-white mb-4">Customer Information</h4>
                                    
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Customer Name *</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={orderFormData.customerName}
                                            onChange={handleOrderFormChange}
                                            required
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={orderFormData.email}
                                            onChange={handleOrderFormChange}
                                            required
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={orderFormData.phone}
                                            onChange={handleOrderFormChange}
                                            required
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={orderFormData.zipCode}
                                            onChange={handleOrderFormChange}
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="Zip code"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={orderFormData.address}
                                        onChange={handleOrderFormChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                        placeholder="Street address"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={orderFormData.city}
                                        onChange={handleOrderFormChange}
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                        placeholder="City"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={orderFormData.notes}
                                        onChange={handleOrderFormChange}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                        placeholder="Special instructions or notes for your order..."
                                    ></textarea>
                                </div>
                                </div>
                                
                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderForm(false)}
                                        className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingOrder}
                                        className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submittingOrder ? 'Submitting...' : 'Submit Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}