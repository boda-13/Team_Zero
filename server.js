// ========================================
// TEAM ZERO - MAIN SERVER
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');

const app = express();

// ========================================
// DATABASE CONNECTION
// ========================================

const { connectDB } = require('./config/database');
connectDB();

// ========================================
// MIDDLEWARE
// ========================================

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'teamzero-session-secret-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// ========================================
// STATIC FILES
// ========================================

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================================
// ROUTES
// ========================================

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// ========================================
// FRONTEND ROUTES
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const pages = ['about', 'blog', 'contact', 'portfolio', 'pricing', 'services', 'team', 'privacy', 'terms'];

pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `public/${page}.html`));
    });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

// ========================================
// ERROR HANDLER
// ========================================

const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// CREATE ADMIN USER (IF NOT EXISTS)
// ========================================
const createAdmin = async () => {
    try {
        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@admin.com' });
        if (!adminExists) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 12);
            const admin = new User({
                username: 'admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                fullName: 'مدير النظام',
                role: 'admin',
                emailVerified: true,
                isActive: true
            });
            await admin.save();
            console.log('✅ Admin user created automatically!');
            console.log('   Email: admin@admin.com');
            console.log('   Password: admin123');
        }
    } catch (error) {
        console.error('Create admin error:', error);
    }
};

// استدعاء الدالة بعد اتصال MongoDB
createAdmin();

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 Team Zero Server (MongoDB Version)                     ║
║   📡 Running on http://localhost:${PORT}                      ║
║   🔧 Environment: ${process.env.NODE_ENV || 'development'}   ║
║                                                              ║
║   🗄️  Database: MongoDB                                      ║
║   📊 Admin Dashboard: http://localhost:${PORT}/admin         ║
║   🏠 Home: http://localhost:${PORT}                          ║
║                                                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;