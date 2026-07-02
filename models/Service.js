// ========================================
// SERVICE MODEL
// ========================================

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم الخدمة مطلوب'],
        trim: true,
        minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل']
    },
    description: {
        type: String,
        required: [true, 'وصف الخدمة مطلوب']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'الوصف المختصر يجب أن لا يتجاوز 200 حرف']
    },
    icon: {
        type: String,
        default: '💻'
    },
    features: [String],
    category: {
        type: String,
        enum: ['web', 'design', 'video', 'other'],
        default: 'other'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);