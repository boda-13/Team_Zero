// ========================================
// AUTH MIDDLEWARE
// ========================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'teamzero-super-secret-key-2026';

// ===== Authenticate =====
const authenticate = async(req, res, next) => {
    try {
        const token = req.headers.authorization ?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'غير مصرح به. يرجى تسجيل الدخول' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'المستخدم غير موجود' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'الحساب غير نشط' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'الرمز غير صالح' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'الرمز منتهي الصلاحية' });
        }
        console.error('Auth error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء التحقق من المصادقة' });
    }
};

// ===== Authorize by Role =====
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'غير مصرح به' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'ليس لديك صلاحية للوصول إلى هذه الصفحة' });
        }
        next();
    };
};

// ===== Check if Admin =====
const isAdmin = authorize('admin');

// ===== Check if Admin or Moderator =====
const isAdminOrModerator = authorize('admin', 'moderator');

module.exports = {
    authenticate,
    authorize,
    isAdmin,
    isAdminOrModerator
};