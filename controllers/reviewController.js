// ========================================
// REVIEW CONTROLLER
// ========================================

const Review = require('../models/Review');

// ===== Get All Reviews =====
exports.getAll = async (req, res) => {
    try {
        const reviews = await Review.find({ isActive: true })
            .populate('user', 'username fullName avatar')
            .populate('project', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب التقييمات' });
    }
};

// ===== Get Approved Reviews =====
exports.getApproved = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved', isActive: true })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(reviews);
    } catch (error) {
        console.error('Get approved reviews error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب التقييمات' });
    }
};

// ===== Update Review =====
exports.update = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!review) {
            return res.status(404).json({ error: 'التقييم غير موجود' });
        }
        res.json({ success: true, review });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث التقييم' });
    }
};

// ===== Delete Review =====
exports.delete = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ error: 'التقييم غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف التقييم بنجاح' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف التقييم' });
    }
};