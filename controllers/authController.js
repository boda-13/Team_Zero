// ========================================
// AUTH CONTROLLER
// ========================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'teamzero-super-secret-key-2026';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// ===== Generate JWT =====
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// ===== Register =====
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'بيانات غير صحيحة',
                details: errors.array()
            });
        }

        const { username, email, password, fullName, phone } = req.body;

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email 
                    ? 'البريد الإلكتروني مستخدم بالفعل' 
                    : 'اسم المستخدم مستخدم بالفعل'
            });
        }

        const user = new User({
            username,
            email,
            password,
            fullName,
            phone: phone || '',
            role: 'member'
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' });
    }
};

// ===== Login =====
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'بيانات غير صحيحة',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'الحساب غير نشط' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            await user.save();
            return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // Reset login attempts
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
};

// ===== Get Current User =====
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }
        res.json(user.toJSON());
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات المستخدم' });
    }
};

// ===== Change Password =====
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'كلمة المرور الحالية والجديدة مطلوبة' });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تغيير كلمة المرور' });
    }
};

// ===== Logout =====
exports.logout = async (req, res) => {
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};