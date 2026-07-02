// ========================================
// AUTH CONTROLLER
// ========================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { sendEmail, sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } = require('../utils/email');

// ===== Generate JWT =====
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
};

// ===== Register =====
exports.register = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'بيانات غير صحيحة',
                details: errors.array()
            });
        }

        const { username, email, password, fullName, phone } = req.body;

        // Check if user exists
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

        // Create user
        const user = new User({
            username,
            email,
            password,
            fullName,
            phone
        });

        // Generate verification token
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, fullName, verificationToken);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.',
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

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // Check if user is banned
        if (user.isBanned) {
            return res.status(403).json({
                error: 'تم حظر حسابك',
                reason: user.banReason || 'تم حظر حسابك من قبل الإدارة'
            });
        }

        // Check if user is locked
        if (user.isLocked) {
            const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                error: `حسابك مقفل. حاول مرة أخرى بعد ${remaining} دقيقة`
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            return res.status(401).json({
                error: `البريد الإلكتروني أو كلمة المرور غير صحيحة (${5 - user.loginAttempts} محاولات متبقية)`
            });
        }

        // Reset login attempts
        await user.resetLoginAttempts();

        // Update last login
        user.lastLogin = new Date();
        user.lastIP = req.ip;
        user.lastUserAgent = req.get('user-agent');
        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Check if two-factor is enabled
        if (user.twoFactorEnabled) {
            return res.json({
                success: true,
                requireTwoFactor: true,
                userId: user._id,
                message: 'يرجى إدخال رمز المصادقة الثنائية'
            });
        }

        res.json({
            success: true,
            token,
            refreshToken,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
};

// ===== Verify Two-Factor =====
exports.verifyTwoFactor = async (req, res) => {
    try {
        const { userId, code } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        const isValid = user.verifyTwoFactorCode(code);
        if (!isValid) {
            return res.status(401).json({ error: 'رمز المصادقة غير صحيح' });
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.json({
            success: true,
            token,
            refreshToken,
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Two-factor verification error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء التحقق' });
    }
};

// ===== Refresh Token =====
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token مطلوب' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'المستخدم غير موجود' });
        }

        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.json({
            success: true,
            token: newToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Refresh token غير صالح' });
    }
};

// ===== Verify Email =====
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                error: 'الرمز غير صالح أو منتهي الصلاحية'
            });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'تم تأكيد البريد الإلكتروني بنجاح'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تأكيد البريد' });
    }
};

// ===== Forgot Password =====
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        const resetToken = user.generateResetToken();
        await user.save();

        await sendResetPasswordEmail(email, user.fullName, resetToken);

        res.json({
            success: true,
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إرسال رابط إعادة التعيين' });
    }
};

// ===== Reset Password =====
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                error: 'الرمز غير صالح أو منتهي الصلاحية'
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'تم إعادة تعيين كلمة المرور بنجاح'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' });
    }
};

// ===== Change Password =====
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تغيير كلمة المرور' });
    }
};

// ===== Logout =====
exports.logout = async (req, res) => {
    try {
        // Invalidate token on client side
        res.json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الخروج' });
    }
};