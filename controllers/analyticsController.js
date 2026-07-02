// ========================================
// ANALYTICS CONTROLLER
// ========================================

const User = require('../models/User');
const Project = require('../models/Project');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Service = require('../models/Service');

// ===== Get Dashboard Stats =====
exports.getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalProjects,
            totalOrders,
            pendingOrders,
            totalMessages,
            unreadMessages,
            totalServices
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Project.countDocuments({ isActive: true }),
            Order.countDocuments({ isActive: true }),
            Order.countDocuments({ status: 'pending', isActive: true }),
            Message.countDocuments({ isActive: true }),
            Message.countDocuments({ read: false, isActive: true }),
            Service.countDocuments({ isActive: true })
        ]);

        res.json({
            users: {
                total: totalUsers,
                active: activeUsers
            },
            projects: totalProjects,
            orders: {
                total: totalOrders,
                pending: pendingOrders
            },
            messages: {
                total: totalMessages,
                unread: unreadMessages
            },
            services: totalServices
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإحصائيات' });
    }
};

// ===== Get Recent Activities =====
exports.getRecentActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent activities from different collections
        const [recentUsers, recentProjects, recentOrders, recentMessages] = await Promise.all([
            User.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('username fullName createdAt role'),
            Project.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('title category createdAt'),
            Order.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('customerName serviceType status createdAt'),
            Message.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('name email status createdAt')
        ]);

        // Format activities
        const activities = [];

        recentUsers.forEach(user => {
            activities.push({
                type: 'user',
                action: 'تسجيل مستخدم جديد',
                user: user.fullName || user.username,
                details: `دور: ${user.role}`,
                time: user.createdAt,
                icon: '👤'
            });
        });

        recentProjects.forEach(project => {
            activities.push({
                type: 'project',
                action: 'إضافة مشروع جديد',
                details: `${project.title} (${project.category})`,
                time: project.createdAt,
                icon: '📁'
            });
        });

        recentOrders.forEach(order => {
            activities.push({
                type: 'order',
                action: 'طلب جديد',
                details: `${order.customerName} - ${order.serviceType}`,
                time: order.createdAt,
                icon: '📦'
            });
        });

        recentMessages.forEach(message => {
            activities.push({
                type: 'message',
                action: 'رسالة جديدة',
                details: `من: ${message.name}`,
                time: message.createdAt,
                icon: '✉️'
            });
        });

        // Sort by time
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        activities.slice(0, limit);

        res.json(activities);

    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الأنشطة' });
    }
};

// ===== Get Analytics =====
exports.getAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        // Calculate date range
        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get analytics data
        const [
            newUsers,
            newProjects,
            newOrders,
            newMessages,
            ordersByStatus,
            messagesByStatus
        ] = await Promise.all([
            User.countDocuments({ 
                createdAt: { $gte: startDate },
                isActive: true 
            }),
            Project.countDocuments({ 
                createdAt: { $gte: startDate },
                isActive: true 
            }),
            Order.countDocuments({ 
                createdAt: { $gte: startDate },
                isActive: true 
            }),
            Message.countDocuments({ 
                createdAt: { $gte: startDate },
                isActive: true 
            }),
            Order.aggregate([
                { $match: { isActive: true } },
                { $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }}
            ]),
            Message.aggregate([
                { $match: { isActive: true } },
                { $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }}
            ])
        ]);

        res.json({
            period: `${days} days`,
            newUsers,
            newProjects,
            newOrders,
            newMessages,
            ordersByStatus,
            messagesByStatus,
            startDate,
            endDate: new Date()
        });

    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب التحليلات' });
    }
};