// ========================================
// ORDER MODEL
// ========================================

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerName: {
        type: String,
        required: [true, 'اسم العميل مطلوب'],
        trim: true
    },
    customerEmail: {
        type: String,
        required: [true, 'البريد الإلكتروني للعميل مطلوب'],
        trim: true,
        lowercase: true
    },
    customerPhone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        trim: true
    },
    serviceType: {
        type: String,
        required: [true, 'نوع الخدمة مطلوب'],
        trim: true
    },
    details: {
        type: String,
        required: [true, 'تفاصيل الطلب مطلوبة'],
        minlength: [10, 'التفاصيل يجب أن تكون 10 أحرف على الأقل']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String,
    isActive: {
        type: Boolean,
        default: true
    },
    completedAt: Date,
    cancelledAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);