// ========================================
// TEAM CONTROLLER
// ========================================

const Team = require('../models/Team');

// ===== Get All Team Members =====
exports.getAll = async (req, res) => {
    try {
        const team = await Team.find({ status: 'نشط' })
            .sort({ createdAt: 1 });
        res.json(team);
    } catch (error) {
        console.error('Get team error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب أعضاء الفريق' });
    }
};

// ===== Get Single Team Member =====
exports.getOne = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: 'العضو غير موجود' });
        }
        res.json(member);
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب العضو' });
    }
};

// ===== Create Team Member =====
exports.create = async (req, res) => {
    try {
        const member = new Team(req.body);
        await member.save();
        res.status(201).json({ success: true, member });
    } catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء العضو' });
    }
};

// ===== Update Team Member =====
exports.update = async (req, res) => {
    try {
        const member = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!member) {
            return res.status(404).json({ error: 'العضو غير موجود' });
        }
        res.json({ success: true, member });
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث العضو' });
    }
};

// ===== Delete Team Member =====
exports.delete = async (req, res) => {
    try {
        const member = await Team.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ error: 'العضو غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف العضو بنجاح' });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف العضو' });
    }
};