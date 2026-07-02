// ========================================
// SETTINGS MODEL
// ========================================

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'Team Zero'
    },
    siteDescription: {
        type: String,
        default: 'وكالة رقمية متكاملة'
    },
    siteKeywords: {
        type: [String],
        default: ['وكالة', 'تصميم', 'تطوير']
    },
    siteLogo: {
        type: String,
        default: 'logo.png'
    },
    siteFavicon: {
        type: String,
        default: 'favicon.ico'
    },
    contactEmail: {
        type: String,
        default: 'info@teamzero.com'
    },
    contactPhone: {
        type: String,
        default: '+966 55 000 0000'
    },
    contactAddress: {
        type: String,
        default: 'الرياض، المملكة العربية السعودية'
    },
    social: {
        whatsapp: { type: String, default: '#' },
        facebook: { type: String, default: '#' },
        instagram: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        youtube: { type: String, default: '#' },
        linkedin: { type: String, default: '#' },
        github: { type: String, default: '#' },
        discord: { type: String, default: '#' }
    },
    hero: {
        title: { type: String, default: 'نبني مواقع ويب حديثة' },
        subtitle: { type: String, default: 'نصمم هويات بصرية احترافية' },
        description: { type: String, default: 'نقدم حلولاً رقمية مبتكرة' },
        image: { type: String, default: 'hero.png' }
    },
    features: {
        projects: { type: Boolean, default: true },
        blog: { type: Boolean, default: true },
        team: { type: Boolean, default: true },
        testimonials: { type: Boolean, default: true },
        services: { type: Boolean, default: true }
    },
    analytics: {
        googleAnalytics: { type: String },
        facebookPixel: { type: String },
        hotjar: { type: String }
    },
    seo: {
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: { type: [String] }
    },
    maintenance: {
        enabled: { type: Boolean, default: false },
        message: { type: String, default: 'الموقع قيد الصيانة، يرجى العودة لاحقاً' }
    },
    theme: {
        primaryColor: { type: String, default: '#6C3CE1' },
        secondaryColor: { type: String, default: '#4A9EFF' },
        darkMode: { type: Boolean, default: true }
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// ===== Ensure only one settings document =====
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);