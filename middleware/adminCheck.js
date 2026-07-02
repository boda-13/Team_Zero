// ========================================
// ADMIN CHECK MIDDLEWARE
// ========================================

const { authenticate } = require('./auth');

// ===== Check if user is admin =====
const checkAdmin = async (req, res, next) => {
    try {
        // First authenticate
        await authenticate(req, res, () => {});
        
        if (!req.user) {
            return res.redirect('/login');
        }

        if (req.user.role !== 'admin') {
            return res.status(403).render('403', {
                message: 'غير مصرح بالوصول إلى لوحة التحكم'
            });
        }

        next();

    } catch (error) {
        console.error('Admin check error:', error);
        res.redirect('/login');
    }
};

// ===== Check if user is admin or moderator =====
const checkAdminOrModerator = async (req, res, next) => {
    try {
        await authenticate(req, res, () => {});
        
        if (!req.user) {
            return res.redirect('/login');
        }

        if (!['admin', 'moderator'].includes(req.user.role)) {
            return res.status(403).render('403', {
                message: 'غير مصرح بالوصول إلى هذه الصفحة'
            });
        }

        next();

    } catch (error) {
        console.error('Admin/moderator check error:', error);
        res.redirect('/login');
    }
};

module.exports = {
    checkAdmin,
    checkAdminOrModerator
};