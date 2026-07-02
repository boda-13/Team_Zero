// ========================================
// MESSAGE MODEL
// ========================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true,
        minlength: [2, 'الاسم يجب أن يكون حرفين على الأقل']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        trim: true,
        lowercase: true
    },
    phone: String,
    service: String,
    message: {
        type: String,
        required: [true, 'الرسالة مطلوبة'],
        minlength: [10, 'الرسالة يجب أن تكون 10 أحرف على الأقل']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    reply: String,
    repliedAt: Date,
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);