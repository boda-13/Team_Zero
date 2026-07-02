// ========================================
// USER CONTROLLER - UPDATED
// ========================================

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ... (previous code remains the same)

// ===== Admin: Get User By ID =====
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -emailVerificationToken -resetPasswordToken -twoFactorSecret -twoFactorBackupCodes');

        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        res.json(user);

    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدم' });
    }
};

// ===== Admin: Create User =====
exports.createUser = async(req, res) => {
    try {
        const { username, email, password, fullName, phone, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email ?
                    'البريد الإلكتروني مستخدم بالفعل' :
                    'اسم المستخدم مستخدم بالفعل'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phone,
            role: role || 'member',
            emailVerified: true,
            isActive: true
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المستخدم بنجاح',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء المستخدم' });
    }
};

// ===== Update Profile =====
exports.updateProfile = async(req, res) => {
    try {
        const { fullName, phone, bio, social, preferences } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (bio) user.bio = bio;
        if (social) user.social = {...user.social, ...social };
        if (preferences) user.preferences = {...user.preferences, ...preferences };

        await user.save();

        res.json({
            success: true,
            message: 'تم تحديث الملف الشخصي بنجاح',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الملف الشخصي' });
    }
};