// ========================================
// TEAM MODEL
// ========================================

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم العضو مطلوب'],
        trim: true,
        minlength: [2, 'الاسم يجب أن يكون حرفين على الأقل']
    },
    role: {
        type: String,
        required: [true, 'الوظيفة مطلوبة'],
        trim: true
    },
    icon: {
        type: String,
        default: '👤'
    },
    bio: String,
    social: {
        linkedin: String,
        github: String,
        twitter: String,
        behance: String,
        youtube: String,
        instagram: String,
        dev: String,
        vimeo: String
    },
    status: {
        type: String,
        enum: ['نشط', 'غير نشط'],
        default: 'نشط'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);