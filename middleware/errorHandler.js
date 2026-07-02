// ========================================
// ERROR HANDLER MIDDLEWARE
// ========================================

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    
    let status = err.status || 500;
    let message = err.message || 'حدث خطأ في الخادم';
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'بيانات غير صالحة';
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'غير مصرح به';
    } else if (err.name === 'NotFoundError') {
        status = 404;
        message = 'غير موجود';
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'معرف غير صالح';
    }
    
    res.status(status).json({
        error: {
            message,
            status,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// ===== 404 Not Found Handler =====
const notFoundHandler = (req, res, next) => {
    const error = new Error(`المسار غير موجود: ${req.url}`);
    error.status = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFoundHandler
};