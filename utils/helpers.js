// ========================================
// HELPER FUNCTIONS
// ========================================

// ===== Generate Slug =====
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// ===== Generate Random ID =====
const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`;
};

// ===== Format Date =====
const formatDate = (date, format = 'ar') => {
    const d = new Date(date);
    if (format === 'ar') {
        return d.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// ===== Truncate Text =====
const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// ===== Validate Email =====
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ===== Validate Phone =====
const isValidPhone = (phone) => {
    return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
};

// ===== Get Client IP =====
const getClientIP = (req) => {
    return req.ip || 
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           'Unknown';
};

module.exports = {
    generateSlug,
    generateId,
    formatDate,
    truncateText,
    isValidEmail,
    isValidPhone,
    getClientIP
};