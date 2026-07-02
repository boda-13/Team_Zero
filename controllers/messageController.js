// ========================================
// MESSAGE CONTROLLER
// ========================================

const Message = require('../models/Message');

// ===== Get All Messages =====
exports.getAll = async (req, res) => {
    try {
        const messages = await Message.find({ isActive: true })
            .populate('repliedBy', 'username fullName')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسائل' });
    }
};

// ===== Get Single Message =====
exports.getOne = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('repliedBy', 'username fullName');
        if (!message) {
            return res.status(404).json({ error: 'الرسالة غير موجودة' });
        }
        res.json(message);
    } catch (error) {
        console.error('Get message error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الرسالة' });
    }
};

// ===== Create Message =====
exports.create = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرسالة' });
    }
};

// ===== Mark Message as Read =====
exports.markRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            {
                read: true,
                status: 'read',
                readAt: new Date()
            },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ error: 'الرسالة غير موجودة' });
        }
        res.json({ success: true, message });
    } catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الرسالة' });
    }
};

// ===== Delete Message =====
exports.delete = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ error: 'الرسالة غير موجودة' });
        }
        res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الرسالة' });
    }
};