import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByCustomer,
    deleteOrder,
    getOrderStatistics
} from '../controllers/ordercontroller.js';

const router = express.Router();

// Public routes (for customers)
router.post('/orders', createOrder);                                    // POST /api/admin/orders - Create new order
router.get('/orders/customer/:email', getOrdersByCustomer);             // GET /api/admin/orders/customer/:email - Get orders by customer email

// Admin routes (should be protected with auth middleware in production)
router.get('/orders', getAllOrders);                                    // GET /api/admin/orders - Get all orders with pagination
router.get('/orders/statistics', getOrderStatistics);                   // GET /api/admin/orders/statistics - Get order statistics
router.get('/orders/:orderId', getOrderById);                          // GET /api/admin/orders/:orderId - Get order by ID
router.put('/orders/:orderId/status', updateOrderStatus);              // PUT /api/admin/orders/:orderId/status - Update order status
router.delete('/orders/:orderId', deleteOrder);                        // DELETE /api/admin/orders/:orderId - Delete order

export default router;
