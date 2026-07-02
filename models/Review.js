// ========================================
// REVIEW MODEL
// ========================================

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true
    },
    email: String,
    rating: {
        type: Number,
        required: [true, 'التقييم مطلوب'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'عنوان التقييم مطلوب'],
        trim: true,
        maxlength: [100, 'العنوان يجب أن لا يتجاوز 100 حرف']
    },
    content: {
        type: String,
        required: [true, 'نص التقييم مطلوب'],
        minlength: [10, 'النص يجب أن يكون 10 أحرف على الأقل'],
        maxlength: [1000, 'النص يجب أن لا يتجاوز 1000 حرف']
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);