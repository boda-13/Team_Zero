// ========================================
// ORDER CONTROLLER
// ========================================

const Order = require('../models/Order');

// ===== Get All Orders =====
exports.getAll = async (req, res) => {
    try {
        const orders = await Order.find({ isActive: true })
            .populate('user', 'username fullName email')
            .populate('assignedTo', 'username fullName')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الطلبات' });
    }
};

// ===== Get Single Order =====
exports.getOne = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username fullName email')
            .populate('assignedTo', 'username fullName');
        if (!order) {
            return res.status(404).json({ error: 'الطلب غير موجود' });
        }
        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الطلب' });
    }
};

// ===== Update Order =====
exports.update = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ error: 'الطلب غير موجود' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الطلب' });
    }
};

// ===== Delete Order =====
exports.delete = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ error: 'الطلب غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الطلب' });
    }
};