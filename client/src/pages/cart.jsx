import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import Navbar from "../components/Navbar";
import { useDesign } from '../context/DesignContext';
import axios from 'axios';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const processingPayPalReturnRef = useRef(false);
    const { room } = useDesign();
    const PENDING_ORDER_KEY = 'pendingFurnitureOrder';
    
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
        roomWidth: room.width,
        roomLength: room.length,
        roomHeight: room.height,
        wallColor: room.wallColor,
        floorColor: room.floorColor
    });
    const [submittingOrder, setSubmittingOrder] = useState(false);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxAmount = cartTotal * 0.08; 
    const finalTotal = cartTotal + taxAmount;

    const clamp = (value, min, max, fallback) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return fallback;
        return Math.min(max, Math.max(min, num));
    };

    const normalizeHexColor = (value, fallback) => {
        const color = String(value || '').trim();
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexColorRegex.test(color) ? color : fallback;
    };

    const normalizeItemImage = (imageValue) => {
        if (Array.isArray(imageValue)) {
            return imageValue.find((img) => typeof img === 'string' && img.trim().length > 0) || '';
        }
        return typeof imageValue === 'string' ? imageValue : '';
    };

    const buildOrderData = () => {
        const normalizedRoomSetup = {
            width: clamp(orderFormData.roomWidth, 1, 20, 5),
            length: clamp(orderFormData.roomLength, 1, 20, 5),
            height: clamp(orderFormData.roomHeight, 2, 5, 3),
            wallColor: normalizeHexColor(orderFormData.wallColor, '#ffffff'),
            floorColor: normalizeHexColor(orderFormData.floorColor, '#f5f5f5')
        };

        return {
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
        roomSetup: normalizedRoomSetup,
        items: cartItems.map((item) => ({
            _id: String(item?._id || ''),
            name: String(item?.name || 'Furniture Item'),
            price: Number(item?.price) || 0,
            quantity: Math.max(1, Number(item?.quantity) || 1),
            category: item?.category ? String(item.category) : undefined,
            image: normalizeItemImage(item?.image)
        })),
        pricing: {
            subtotal: cartTotal,
            tax: taxAmount,
            total: finalTotal
        },
        notes: orderFormData.notes,
        orderDate: new Date().toISOString()
    };
    };

    useEffect(() => {
        loadCartItems();
        const handleCartUpdate = () => {
            loadCartItems();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paypalOrderId = params.get('token');
        const cancelled = params.get('paypal') === 'cancel';

        if (cancelled) {
            toast.error('PayPal payment was cancelled');
            navigate('/cart', { replace: true });
            return;
        }

        if (!paypalOrderId || processingPayPalReturnRef.current) {
            return;
        }

        const finalizePayPalPayment = async () => {
            processingPayPalReturnRef.current = true;
            setSubmittingOrder(true);

            try {
                const pendingRaw = sessionStorage.getItem(PENDING_ORDER_KEY);
                if (!pendingRaw) {
                    throw new Error('No pending order found for this payment');
                }

                const pendingData = JSON.parse(pendingRaw);
                const orderData = pendingData?.orderData;

                if (!orderData) {
                    throw new Error('Pending order data is invalid');
                }

                const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                const authHeaders = { Authorization: `Bearer ${localStorage.getItem('token')}` };

                await axios.post(
                    `${apiUrl}/api/admin/orders/paypal/capture`,
                    { orderId: paypalOrderId },
                    { headers: authHeaders }
                );

                await axios.post(
                    `${apiUrl}/api/admin/orders`,
                    orderData,
                    { headers: authHeaders }
                );

                sessionStorage.removeItem(PENDING_ORDER_KEY);
                localStorage.removeItem('furnitureCart');
                setCartItems([]);
                setShowOrderForm(false);
                window.dispatchEvent(new Event('cartUpdated'));
                toast.success('Payment successful! Order submitted.');
            } catch (error) {
                console.error('Error finalizing PayPal payment:', error);
                const serverMessage = error?.response?.data?.message;
                const validationErrors = error?.response?.data?.errors;
                const detailedMessage = Array.isArray(validationErrors) && validationErrors.length > 0
                    ? `${serverMessage || 'Validation error'}: ${validationErrors[0]}`
                    : (serverMessage || error?.message || 'Failed to finalize PayPal payment');
                toast.error(detailedMessage);
            } finally {
                setSubmittingOrder(false);
                processingPayPalReturnRef.current = false;
                navigate('/cart', { replace: true });
            }
        };

        finalizePayPalPayment();
    }, [location.search, navigate]);

    const loadCartItems = () => {
        try {
            const items = JSON.parse(localStorage.getItem('furnitureCart')) || [];
            setCartItems(items);
        } catch {
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
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
            toast.error('Failed to update quantity');
        }
    };

    const handleRemoveItem = (itemId, itemName) => {
        try {
            const updatedItems = cartItems.filter(item => item._id !== itemId);
            setCartItems(updatedItems);
            localStorage.setItem('furnitureCart', JSON.stringify(updatedItems));
            toast.success(`${itemName} removed`);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
            toast.error('Failed to remove item');
        }
    };

    const handleClearCart = () => {
        try {
            localStorage.removeItem('furnitureCart');
            setCartItems([]);
            toast.success('Cart cleared');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
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
        if (!orderFormData.customerName || !orderFormData.email || !orderFormData.phone || !orderFormData.address) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setSubmittingOrder(true);
        try {
            const orderData = buildOrderData();
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const returnUrl = `${window.location.origin}/cart`;
            const cancelUrl = `${window.location.origin}/cart?paypal=cancel`;

            sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({ orderData, createdAt: Date.now() }));

            const response = await axios.post(`${apiUrl}/api/admin/orders/paypal/create`, {
                total: Number(finalTotal).toFixed(2),
                currency: 'LKR',
                returnUrl,
                cancelUrl
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const payableCurrency = response?.data?.data?.payableCurrency;
            const payableTotal = response?.data?.data?.payableTotal;
            if (payableCurrency && payableTotal) {
                toast.success(`Redirecting to PayPal (${payableCurrency} ${payableTotal})...`);
            }

            const approvalUrl = response?.data?.data?.approvalUrl;
            if (!approvalUrl) {
                throw new Error('PayPal approval URL not received');
            }

            window.location.href = approvalUrl;
        } catch (error) {
            sessionStorage.removeItem(PENDING_ORDER_KEY);
            const serverMessage = error?.response?.data?.message;
            const validationErrors = error?.response?.data?.errors;
            const detailedMessage = Array.isArray(validationErrors) && validationErrors.length > 0
                ? `${serverMessage || 'Validation error'}: ${validationErrors[0]}`
                : (serverMessage || error?.message || 'Failed to start PayPal checkout');
            toast.error(detailedMessage);
        } finally {
            setSubmittingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfe] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#2f27ce]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-white">
            <Navbar />
            
            <div className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                            <FaShoppingCart className="text-[#2f27ce]" /> Your Cart
                        </h1>
                        <p className="text-[#050315]/50 font-medium uppercase tracking-widest text-xs">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
                        </p>
                    </div>
                    {cartItems.length > 0 && (
                        <button onClick={handleClearCart} className="text-rose-600 font-bold text-sm hover:text-rose-700 transition-colors underline underline-offset-4">
                            Empty Cart
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-[#dedcff]/50 shadow-xl shadow-[#050315]/5">
                        <FaShoppingCart className="h-20 w-20 text-[#dedcff] mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-[#050315] mb-2">Your cart is empty</h2>
                        <p className="text-[#050315]/50 mb-8 font-medium">Looks like you haven't added anything yet.</p>
                        <button onClick={() => navigate('/furniture')} className="bg-[#2f27ce] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#433bff] transition-all shadow-lg shadow-[#2f27ce]/20 active:scale-95">
                            Start Exploring
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-3xl p-5 border border-[#dedcff]/50 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-[#fbfbfe] rounded-2xl overflow-hidden border border-[#dedcff]/30">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-black text-[#050315] leading-tight mb-1">{item.name}</h3>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2f27ce] bg-[#dedcff] px-2 py-0.5 rounded">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <button onClick={() => handleRemoveItem(item._id, item.name)} className="text-[#050315]/20 hover:text-rose-500 transition-colors p-2">
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                                                <div className="flex items-center gap-4 bg-[#fbfbfe] px-3 py-2 rounded-xl border border-[#dedcff]">
                                                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="text-[#2f27ce] disabled:text-[#dedcff] transition-colors"><FaMinus size={12}/></button>
                                                    <span className="font-black text-[#050315] min-w-[20px] text-center">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="text-[#2f27ce] transition-colors"><FaPlus size={12}/></button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-[#050315]/40 line-through">Rs. {(item.price * 1.1).toLocaleString()}</p>
                                                    <p className="text-xl font-black text-[#2f27ce]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Cart Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-[2rem] p-8 border border-[#dedcff]/50 shadow-xl shadow-[#050315]/5 sticky top-32">
                                <h2 className="text-xl font-black text-[#050315] mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm font-bold text-[#050315]/60">
                                        <span>Subtotal</span>
                                        <span>Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-[#050315]/60">
                                        <span>Tax (8%)</span>
                                        <span>Rs. {taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-[#dedcff] w-full my-2"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-[#050315]">Total</span>
                                        <span className="text-2xl font-black text-[#2f27ce]">Rs. {finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-[#2f27ce] text-white font-black py-4 rounded-2xl hover:bg-[#433bff] transition-all shadow-lg shadow-[#2f27ce]/20 active:scale-95 mb-4">
                                    Proceed to Checkout
                                </button>
                                <button onClick={() => navigate('/furniture')} className="w-full bg-white text-[#050315] border-2 border-[#dedcff] font-bold py-4 rounded-2xl hover:bg-[#fbfbfe] transition-all">
                                    Keep Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Order Form Modal */}
                {showOrderForm && (
                    <div className="fixed inset-0 bg-[#050315]/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dedcff] scrollbar-hide">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#050315]">Checkout Details</h2>
                                    <p className="text-[#050315]/50 text-sm font-medium">Please provide your delivery information.</p>
                                </div>
                                <button onClick={() => setShowOrderForm(false)} className="bg-[#fbfbfe] p-2 rounded-full border border-[#dedcff] text-[#050315]/40 hover:text-[#050315] transition-colors">
                                    <FaPlus className="rotate-45" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmitOrder} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">Full Name</label>
                                        <input type="text" name="customerName" value={orderFormData.customerName} onChange={handleOrderFormChange} required className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">Email Address</label>
                                        <input type="email" name="email" value={orderFormData.email} onChange={handleOrderFormChange} required className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">Phone Number</label>
                                        <input type="tel" name="phone" value={orderFormData.phone} onChange={handleOrderFormChange} required className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all" placeholder="+94 XX XXX XXXX" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">City</label>
                                        <input type="text" name="city" value={orderFormData.city} onChange={handleOrderFormChange} className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all" placeholder="Colombo" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">Delivery Address</label>
                                    <input type="text" name="address" value={orderFormData.address} onChange={handleOrderFormChange} required className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all" placeholder="No 123, Galle Road" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/40 ml-1">Additional Notes</label>
                                    <textarea name="notes" value={orderFormData.notes} onChange={handleOrderFormChange} rows="2" className="w-full px-4 py-3.5 bg-[#fbfbfe] border-2 border-transparent focus:border-[#2f27ce] rounded-xl outline-none font-bold text-[#050315] transition-all resize-none" placeholder="Any special requests?"></textarea>
                                </div>
                                
                                <div className="p-6 bg-[#dedcff]/30 rounded-3xl border border-[#dedcff]">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-black text-[#050315]">Grand Total</span>
                                        <span className="text-2xl font-black text-[#2f27ce]">Rs. {finalTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setShowOrderForm(false)} className="px-4 py-3.5 bg-white text-[#050315] border-2 border-[#dedcff] font-bold rounded-xl hover:bg-[#fbfbfe] transition-all">Cancel</button>
                                        <button type="submit" disabled={submittingOrder} className="px-4 py-3.5 bg-[#2f27ce] text-white font-black rounded-xl hover:bg-[#433bff] transition-all shadow-lg shadow-[#2f27ce]/20 disabled:opacity-50">
                                            {submittingOrder ? 'Processing...' : 'Pay with PayPal'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}