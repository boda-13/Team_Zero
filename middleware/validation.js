// ========================================
// VALIDATION MIDDLEWARE
// ========================================

const { validationResult, body } = require('express-validator');

// ===== Validation Rules =====
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'بيانات غير صحيحة',
            details: errors.array()
        });
    }
    next();
};

// ===== User Registration Validation =====
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('اسم المستخدم يجب أن يكون بين 3 و 30 حرف')
        .matches(/^[a-zA-Z0-9_\u0600-\u06FF]+$/)
        .withMessage('اسم المستخدم يحتوي على أحرف غير مسموحة'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('البريد الإلكتروني غير صحيح')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'),
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('الاسم الكامل يجب أن يكون بين 2 و 100 حرف'),
    validate
];

// ===== Login Validation =====
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('البريد الإلكتروني غير صحيح')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('كلمة المرور مطلوبة'),
    validate
];

// ===== Contact Message Validation =====
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('الاسم مطلوب و يجب أن يكون حرفين على الأقل'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('البريد الإلكتروني غير صحيح'),
    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('الرسالة مطلوبة و يجب أن تكون 10 أحرف على الأقل'),
    validate
];

// ===== Project Validation =====
const projectValidation = [
    body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('عنوان المشروع مطلوب و يجب أن يكون 3 أحرف على الأقل'),
    body('category')
        .isIn(['web', 'design', 'video'])
        .withMessage('تصنيف غير صالح'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('الوصف مطلوب و يجب أن يكون 10 أحرف على الأقل'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    contactValidation,
    projectValidation,
    validate
};