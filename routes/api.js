// ========================================
// API ROUTES
// ========================================

const express = require('express');
const router = express.Router();

const { authenticate, isAdmin, isAdminOrModerator } = require('../middleware/auth');
const { contactValidation } = require('../middleware/validation');

// ===== Controllers =====
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const serviceController = require('../controllers/serviceController');
const teamController = require('../controllers/teamController');
const messageController = require('../controllers/messageController');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');

// ========================================
// PUBLIC ROUTES
// ========================================

// ===== Auth =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ===== Projects =====
router.get('/projects', projectController.getAll);
router.get('/projects/:id', projectController.getOne);

// ===== Services =====
router.get('/services', serviceController.getAll);
router.get('/services/:id', serviceController.getOne);

// ===== Team =====
router.get('/team', teamController.getAll);
router.get('/team/:id', teamController.getOne);

// ===== Reviews =====
router.get('/reviews', reviewController.getApproved);

// ===== Contact =====
router.post('/contact', contactValidation, messageController.create);

// ========================================
// PROTECTED ROUTES
// ========================================

router.use(authenticate);

// ===== Auth =====
router.get('/auth/me', authController.getMe);
router.post('/auth/change-password', authController.changePassword);
router.post('/auth/logout', authController.logout);

// ===== Profile =====
router.get('/profile', authController.getMe);

// ========================================
// ADMIN ROUTES
// ========================================

// ===== Dashboard Stats =====
router.get('/admin/stats', isAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const Project = require('../models/Project');
        const Service = require('../models/Service');
        const Team = require('../models/Team');
        const Message = require('../models/Message');
        const Order = require('../models/Order');
        const Review = require('../models/Review');

        const [users, projects, services, team, messages, orders, reviews] = await Promise.all([
            User.countDocuments({ isActive: true }),
            Project.countDocuments({ isActive: true }),
            Service.countDocuments({ isActive: true }),
            Team.countDocuments({ status: 'نشط' }),
            Message.countDocuments({ isActive: true }),
            Order.countDocuments({ isActive: true }),
            Review.countDocuments({ status: 'approved', isActive: true })
        ]);

        res.json({ users, projects, services, team, messages, orders, reviews });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإحصائيات' });
    }
});

// ===== Projects =====
router.get('/admin/projects', isAdminOrModerator, projectController.getAll);
router.post('/admin/projects', isAdminOrModerator, projectController.create);
router.put('/admin/projects/:id', isAdminOrModerator, projectController.update);
router.delete('/admin/projects/:id', isAdminOrModerator, projectController.delete);

// ===== Services =====
router.get('/admin/services', isAdminOrModerator, serviceController.getAll);
router.post('/admin/services', isAdminOrModerator, serviceController.create);
router.put('/admin/services/:id', isAdminOrModerator, serviceController.update);
router.delete('/admin/services/:id', isAdminOrModerator, serviceController.delete);

// ===== Team =====
router.get('/admin/team', isAdminOrModerator, teamController.getAll);
router.post('/admin/team', isAdminOrModerator, teamController.create);
router.put('/admin/team/:id', isAdminOrModerator, teamController.update);
router.delete('/admin/team/:id', isAdminOrModerator, teamController.delete);

// ===== Messages =====
router.get('/admin/messages', isAdminOrModerator, messageController.getAll);
router.put('/admin/messages/:id/read', isAdminOrModerator, messageController.markRead);
router.delete('/admin/messages/:id', isAdminOrModerator, messageController.delete);

// ===== Orders =====
router.get('/admin/orders', isAdminOrModerator, orderController.getAll);
router.put('/admin/orders/:id', isAdminOrModerator, orderController.update);
router.delete('/admin/orders/:id', isAdminOrModerator, orderController.delete);

// ===== Reviews =====
router.get('/admin/reviews', isAdminOrModerator, reviewController.getAll);
router.put('/admin/reviews/:id', isAdminOrModerator, reviewController.update);
router.delete('/admin/reviews/:id', isAdminOrModerator, reviewController.delete);

module.exports = router;