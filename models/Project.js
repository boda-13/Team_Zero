// ========================================
// PROJECT MODEL
// ========================================

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان المشروع مطلوب'],
        trim: true,
        minlength: [3, 'العنوان يجب أن يكون 3 أحرف على الأقل']
    },
    category: {
        type: String,
        required: [true, 'التصنيف مطلوب'],
        enum: ['web', 'design', 'video']
    },
    description: {
        type: String,
        required: [true, 'الوصف مطلوب']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'الوصف المختصر يجب أن لا يتجاوز 200 حرف']
    },
    image: String,
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'pending'],
        default: 'pending'
    },
    client: String,
    technologies: [String],
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);