// ========================================
// SETTINGS CONTROLLER
// ========================================

const Settings = require('../models/Settings');

// ===== Get Settings =====
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإعدادات' });
    }
};

// ===== Update Settings =====
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        
        // Update fields
        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (typeof updates[key] === 'object' && updates[key] !== null) {
                settings[key] = { ...settings[key], ...updates[key] };
            } else {
                settings[key] = updates[key];
            }
        });

        settings.updatedBy = req.user.id;
        await settings.save();

        res.json({
            success: true,
            message: 'تم تحديث الإعدادات بنجاح',
            settings
        });

    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الإعدادات' });
    }
};