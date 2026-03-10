import Order from '../models/order.js';
import jwt from 'jsonwebtoken';

// Helper function to extract user ID from token
const getUserIdFromToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id || decoded.userId;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

// Create a new order
export const createOrder = async (req, res) => {
    try {
        console.log('Received order data:', req.body);
        
        const {
            customer,
            roomSetup,
            items,
            pricing,
            notes
        } = req.body;

        // Validate required fields
        if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address?.street) {
            return res.status(400).json({
                success: false,
                message: 'Missing required customer information'
            });
        }

        if (!roomSetup || !roomSetup.width || !roomSetup.length || !roomSetup.height) {
            return res.status(400).json({
                success: false,
                message: 'Missing required room setup information'
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        if (!pricing || typeof pricing.total !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Missing required pricing information'
            });
        }

        // Validate room dimensions
        if (roomSetup.width < 1 || roomSetup.width > 20 ||
            roomSetup.length < 1 || roomSetup.length > 20 ||
            roomSetup.height < 2 || roomSetup.height > 5) {
            return res.status(400).json({
                success: false,
                message: 'Room dimensions are outside valid range'
            });
        }

        // Validate color format (hex colors)
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexColorRegex.test(roomSetup.wallColor) || !hexColorRegex.test(roomSetup.floorColor)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid color format. Please use hex colors (e.g., #ffffff)'
            });
        }

        // Extract user ID from authorization header if present
        const authHeader = req.headers.authorization;
        const userId = getUserIdFromToken(authHeader);
        
        // Create new order
        const newOrder = new Order({
            userId: userId, // Will be null for guest orders
            customer,
            roomSetup,
            items,
            pricing,
            notes: notes || '',
            status: 'pending',
            orderDate: new Date()
        });

        // Save order to database
        const savedOrder = await newOrder.save();
        console.log('Order saved successfully:', savedOrder._id);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: savedOrder._id,
                status: savedOrder.status,
                orderDate: savedOrder.orderDate,
                summary: savedOrder.getSummary()
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while creating order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;
        
        const orders = await Order.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
                validStatuses
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        const updatedOrder = await order.save();

        console.log(`Order ${orderId} status updated to ${status}`);

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: {
                orderId: updatedOrder._id,
                status: updatedOrder.status,
                summary: updatedOrder.getSummary()
            }
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while updating order status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Get orders by customer email or user ID
export const getOrdersByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const authHeader = req.headers.authorization;
        const userId = getUserIdFromToken(authHeader);

        if (!email && !userId) {
            return res.status(400).json({
                success: false,
                message: 'Customer email or authentication required'
            });
        }

        let orders = [];
        
        // If user is authenticated, get orders by user ID first
        if (userId) {
            orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
        }
        
        // If no orders found by user ID or user not authenticated, try by email
        if (orders.length === 0 && email) {
            orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            data: {
                orders,
                totalOrders: orders.length
            }
        });

    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching customer orders',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.findByIdAndDelete(orderId);
        console.log(`Order ${orderId} deleted successfully`);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

// Get order statistics (Admin)
export const getOrderStatistics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const shippingOrders = await Order.countDocuments({ status: 'shipping' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Calculate total revenue from delivered orders
        const revenueResult = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Get recent orders (last 10)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('customer.name pricing.total status orderDate');

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                ordersByStatus: {
                    pending: pendingOrders,
                    confirmed: confirmedOrders,
                    processing: processingOrders,
                    shipping: shippingOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders
                },
                totalRevenue,
                recentOrders
            }
        });

    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching order statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};
