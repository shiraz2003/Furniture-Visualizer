import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Optional for guest orders
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: false
            },
            zipCode: {
                type: String,
                required: false
            }
        }
    },
    roomSetup: {
        width: {
            type: Number,
            required: true,
            min: 1,
            max: 20
        },
        length: {
            type: Number,
            required: true,
            min: 1,
            max: 20
        },
        height: {
            type: Number,
            required: true,
            min: 2,
            max: 5
        },
        wallColor: {
            type: String,
            required: true,
            match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        },
        floorColor: {
            type: String,
            required: true,
            match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        }
    },
    items: [{
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        category: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        }
    }],
    pricing: {
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        tax: {
            type: Number,
            required: true,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    notes: {
        type: String,
        required: false,
        maxLength: 1000
    },
    status: {
        type: String,
        
        default: 'completed'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Instance method to get order summary
orderSchema.methods.getSummary = function() {
    const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    return {
        orderId: this._id,
        customerName: this.customer.name,
        totalItems: totalItems,
        total: this.pricing.total,
        status: this.status,
        orderDate: this.orderDate,
        roomDimensions: `${this.roomSetup.width}m × ${this.roomSetup.length}m × ${this.roomSetup.height}m`
    };
};

// Static method to find orders by customer email
orderSchema.statics.findByCustomerEmail = function(email) {
    return this.find({ 'customer.email': email }).sort({ createdAt: -1 });
};

// Static method to get orders by status
orderSchema.statics.findByStatus = function(status) {
    return this.find({ status }).sort({ createdAt: -1 });
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
