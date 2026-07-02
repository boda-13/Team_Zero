// ========================================
// SERVICE CONTROLLER
// ========================================

const Service = require('../models/Service');

// ===== Get All Services =====
exports.getAll = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true })
            .sort({ order: 1 });
        res.json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الخدمات' });
    }
};

// ===== Get Single Service =====
exports.getOne = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service || !service.isActive) {
            return res.status(404).json({ error: 'الخدمة غير موجودة' });
        }
        res.json(service);
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الخدمة' });
    }
};

// ===== Create Service =====
exports.create = async (req, res) => {
    try {
        const count = await Service.countDocuments();
        const service = new Service({
            ...req.body,
            order: count + 1
        });
        await service.save();
        res.status(201).json({ success: true, service });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الخدمة' });
    }
};

// ===== Update Service =====
exports.update = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ error: 'الخدمة غير موجودة' });
        }
        res.json({ success: true, service });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الخدمة' });
    }
};

// ===== Delete Service =====
exports.delete = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ error: 'الخدمة غير موجودة' });
        }
        res.json({ success: true, message: 'تم حذف الخدمة بنجاح' });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الخدمة' });
    }
};