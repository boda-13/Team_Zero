// ========================================
// PROJECT CONTROLLER
// ========================================

const Project = require('../models/Project');

// ===== Get All Projects =====
exports.getAll = async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المشاريع' });
    }
};

// ===== Get Single Project =====
exports.getOne = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project || !project.isActive) {
            return res.status(404).json({ error: 'المشروع غير موجود' });
        }
        project.views += 1;
        await project.save();
        res.json(project);
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المشروع' });
    }
};

// ===== Create Project =====
exports.create = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json({ success: true, project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء المشروع' });
    }
};

// ===== Update Project =====
exports.update = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'المشروع غير موجود' });
        }
        res.json({ success: true, project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث المشروع' });
    }
};

// ===== Delete Project =====
exports.delete = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'المشروع غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف المشروع بنجاح' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف المشروع' });
    }
};