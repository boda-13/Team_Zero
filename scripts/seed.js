// ============================================================
// SEED DATABASE - FULL RESET & FRESH DATA
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Team = require('../models/Team');
const Message = require('../models/Message');
const Order = require('../models/Order');
const Review = require('../models/Review');

// ============================================================
// MOCK DATA
// ============================================================

const USERS = [
    {
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
        fullName: 'مدير النظام',
        role: 'admin',
        emailVerified: true,
        isActive: true,
    },
    {
        username: 'teamzero',
        email: 'admin@teamzero.com',
        password: 'TeamZero@2026',
        fullName: 'Team Zero Admin',
        role: 'admin',
        emailVerified: true,
        isActive: true,
    },
    {
        username: 'moderator',
        email: 'moderator@admin.com',
        password: 'moderator123',
        fullName: 'مشرف المحتوى',
        role: 'moderator',
        emailVerified: true,
        isActive: true,
    },
    {
        username: 'ahmed',
        email: 'ahmed@example.com',
        password: 'ahmed123',
        fullName: 'أحمد محمد',
        role: 'member',
        emailVerified: true,
        isActive: true,
    },
    {
        username: 'sara',
        email: 'sara@example.com',
        password: 'sara123',
        fullName: 'سارة خالد',
        role: 'member',
        emailVerified: true,
        isActive: true,
    },
];

const PROJECTS = [
    {
        title: 'شركة تكنو',
        category: 'web',
        description: 'موقع شركة تقنية متكامل يقدم حلولاً برمجية مبتكرة مع لوحة تحكم متقدمة.',
        shortDescription: 'موقع شركة تقنية متكامل',
        featured: true,
        status: 'completed',
        client: 'شركة تكنو',
        technologies: ['React', 'Node.js', 'MongoDB'],
    },
    {
        title: 'متجر زيتونة',
        category: 'web',
        description: 'متجر إلكتروني متكامل للمنتجات الطبيعية والعضوية مع نظام دفع آمن.',
        shortDescription: 'متجر إلكتروني للمنتجات الطبيعية',
        featured: true,
        status: 'completed',
        client: 'زيتونة',
        technologies: ['Vue.js', 'Laravel', 'MySQL'],
    },
    {
        title: 'هوية براند',
        category: 'design',
        description: 'هوية بصرية متكاملة لعلامة تجارية متميزة تشمل الشعار والألوان والخطوط.',
        shortDescription: 'هوية بصرية متكاملة',
        featured: true,
        status: 'completed',
        client: 'براند',
        technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    },
    {
        title: 'إعلان تسويقي',
        category: 'video',
        description: 'فيديو إعلاني احترافي بجودة عالية لمدة 30 ثانية للتسويق الرقمي.',
        shortDescription: 'فيديو إعلاني احترافي',
        featured: false,
        status: 'completed',
        client: 'شركة تسويق',
        technologies: ['Premiere Pro', 'After Effects'],
    },
    {
        title: 'منصة تعليمية',
        category: 'web',
        description: 'منصة تعليمية تفاعلية تقدم دورات تدريبية عبر الإنترنت مع نظام إدارة التعلم.',
        shortDescription: 'منصة تعليمية تفاعلية',
        featured: false,
        status: 'in-progress',
        client: 'أكاديمية المستقبل',
        technologies: ['Next.js', 'Node.js', 'PostgreSQL'],
    },
    {
        title: 'تطبيق جوال',
        category: 'web',
        description: 'تطبيق موبايل متكامل يعمل على iOS و Android لإدارة المهام اليومية.',
        shortDescription: 'تطبيق موبايل متكامل',
        featured: false,
        status: 'pending',
        client: 'شركة تقنية',
        technologies: ['React Native', 'Firebase'],
    },
];

const SERVICES = [
    {
        name: 'تطوير المواقع',
        description: 'نبني مواقع احترافية متجاوبة بأحدث التقنيات لتكون علامتك التجارية مميزة.',
        shortDescription: 'مواقع شركات، متاجر إلكترونية، لوحات تحكم',
        icon: '💻',
        features: ['مواقع شركات', 'متاجر إلكترونية', 'لوحات تحكم', 'أنظمة مخصصة'],
        category: 'web',
        order: 1,
    },
    {
        name: 'التصميم الإبداعي',
        description: 'هويات بصرية وتصاميم مميزة تعكس شخصية علامتك التجارية وتجذب العملاء.',
        shortDescription: 'شعارات، هوية بصرية، تصاميم سوشيال ميديا',
        icon: '🎨',
        features: ['Logo Design', 'Brand Identity', 'Social Media', 'UI/UX'],
        category: 'design',
        order: 2,
    },
    {
        name: 'المونتاج والإنتاج',
        description: 'محتوى بصري احترافي يجذب الجمهور ويزيد من التفاعل على منصات التواصل.',
        shortDescription: 'مونتاج ألعاب، ريلز، فيديوهات يوتيوب',
        icon: '🎬',
        features: ['Gaming Montage', 'Reels & Shorts', 'YouTube Videos', 'Motion Graphics'],
        category: 'video',
        order: 3,
    },
];

const TEAM_MEMBERS = [
    {
        name: 'أحمد محمد',
        role: 'المدير التنفيذي',
        icon: '👨‍💻',
        status: 'نشط',
        social: { linkedin: '#', github: '#', twitter: '#' },
        bio: 'خبرة 10 سنوات في مجال التقنية والقيادة وإدارة الفرق.',
    },
    {
        name: 'سارة خالد',
        role: 'مصممة UI/UX',
        icon: '🎨',
        status: 'نشط',
        social: { linkedin: '#', github: '#', behance: '#' },
        bio: 'مصممة إبداعية مع شغف بالتفاصيل وتقديم تجارب مستخدم مميزة.',
    },
    {
        name: 'محمد علي',
        role: 'مطور Full Stack',
        icon: '⚡',
        status: 'نشط',
        social: { linkedin: '#', github: '#', dev: '#' },
        bio: 'مطور متمرس في بناء التطبيقات المتكاملة باستخدام أحدث التقنيات.',
    },
    {
        name: 'نورا إبراهيم',
        role: 'مونتير ومخرج',
        icon: '🎬',
        status: 'نشط',
        social: { linkedin: '#', youtube: '#', vimeo: '#' },
        bio: 'مخرجة ومونتيرة محترفة في صناعة المحتوى البصري والإعلانات.',
    },
    {
        name: 'خالد سعد',
        role: 'مسوق رقمي',
        icon: '📈',
        status: 'نشط',
        social: { linkedin: '#', twitter: '#', instagram: '#' },
        bio: 'خبير في التسويق الرقمي وزيادة المبيعات عبر الإنترنت.',
    },
    {
        name: 'ريم العتيبي',
        role: 'مديرة مشاريع',
        icon: '📋',
        status: 'نشط',
        social: { linkedin: '#', github: '#', twitter: '#' },
        bio: 'مديرة مشاريع محترفة مع خبرة في إدارة الفرق وتنفيذ المشاريع بنجاح.',
    },
];

const REVIEWS = [
    {
        name: 'خالد العتيبي',
        rating: 5,
        title: 'خدمة ممتازة ورائعة',
        content: 'فريق Team Zero قام بعمل رائع في تصميم موقعنا، أنصح بهم بشدة.',
        status: 'approved',
        verified: true,
    },
    {
        name: 'أحمد السليمان',
        rating: 4,
        title: 'عمل احترافي وجودة عالية',
        content: 'تعامل راقي وجودة عالية في التصميم، سعيد بالنتيجة النهائية.',
        status: 'approved',
        verified: true,
    },
    {
        name: 'نورة الفهد',
        rating: 5,
        title: 'تجربة مميزة',
        content: 'فريق محترف وسريع في التنفيذ. أنصح الجميع بالتعامل معهم.',
        status: 'pending',
        verified: false,
    },
];

const MESSAGES = [
    {
        name: 'فيصل الحربي',
        email: 'faisal@example.com',
        phone: '+966501234567',
        service: 'تطوير المواقع',
        message: 'أريد موقعًا إلكترونيًا لشركتي مع متجر إلكتروني.',
        read: false,
        isActive: true,
    },
    {
        name: 'منى الشمري',
        email: 'mona@example.com',
        phone: '+966551234567',
        service: 'التصميم الإبداعي',
        message: 'أحتاج هوية بصرية متكاملة لعلامتي التجارية الجديدة.',
        read: false,
        isActive: true,
    },
    {
        name: 'سعود المطيري',
        email: 'saud@example.com',
        phone: '+966541234567',
        service: 'المونتاج والإنتاج',
        message: 'أريد مونتاج احترافي لفيديوهات اليوتيوب الخاصة بي.',
        read: true,
        isActive: true,
    },
];

const ORDERS = [
    {
        customerName: 'شركة تكنو',
        customerEmail: 'techco@example.com',
        serviceType: 'تطوير المواقع',
        status: 'completed',
        priority: 'high',
        isActive: true,
    },
    {
        customerName: 'زيتونة',
        customerEmail: 'olive@example.com',
        serviceType: 'تطوير المواقع',
        status: 'in-progress',
        priority: 'medium',
        isActive: true,
    },
    {
        customerName: 'براند',
        customerEmail: 'brand@example.com',
        serviceType: 'التصميم الإبداعي',
        status: 'pending',
        priority: 'low',
        isActive: true,
    },
    {
        customerName: 'شركة تسويق',
        customerEmail: 'marketing@example.com',
        serviceType: 'المونتاج والإنتاج',
        status: 'completed',
        priority: 'high',
        isActive: true,
    },
];

// ============================================================
// SEED FUNCTION
// ============================================================

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamzero';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // ===== CLEAR DATABASE =====
        console.log('\n🗑️  Clearing all collections...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Service.deleteMany({});
        await Team.deleteMany({});
        await Message.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        console.log('✅ All collections cleared');

        // ===== SEED USERS =====
        console.log('\n📝 Seeding users...');
        const hashedUsers = await Promise.all(
            USERS.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 12);
                return { ...user, password: hashedPassword };
            })
        );
        await User.insertMany(hashedUsers);
        console.log(`✅ ${USERS.length} users created`);

        // ===== SEED PROJECTS =====
        console.log('\n📝 Seeding projects...');
        await Project.insertMany(PROJECTS);
        console.log(`✅ ${PROJECTS.length} projects created`);

        // ===== SEED SERVICES =====
        console.log('\n📝 Seeding services...');
        await Service.insertMany(SERVICES);
        console.log(`✅ ${SERVICES.length} services created`);

        // ===== SEED TEAM =====
        console.log('\n📝 Seeding team...');
        await Team.insertMany(TEAM_MEMBERS);
        console.log(`✅ ${TEAM_MEMBERS.length} team members created`);

        // ===== SEED REVIEWS =====
        console.log('\n📝 Seeding reviews...');
        await Review.insertMany(REVIEWS);
        console.log(`✅ ${REVIEWS.length} reviews created`);

        // ===== SEED MESSAGES =====
        console.log('\n📝 Seeding messages...');
        await Message.insertMany(MESSAGES);
        console.log(`✅ ${MESSAGES.length} messages created`);

        // ===== SEED ORDERS =====
        console.log('\n📝 Seeding orders...');
        await Order.insertMany(ORDERS);
        console.log(`✅ ${ORDERS.length} orders created`);

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log('\n════════════════════════════════════════════════════════');
        console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
        console.log('════════════════════════════════════════════════════════');

        console.log('\n📊 Summary:');
        console.log(`   👥 Users: ${USERS.length}`);
        console.log(`   📁 Projects: ${PROJECTS.length}`);
        console.log(`   ⚙️  Services: ${SERVICES.length}`);
        console.log(`   👤 Team: ${TEAM_MEMBERS.length}`);
        console.log(`   ⭐ Reviews: ${REVIEWS.length}`);
        console.log(`   ✉️  Messages: ${MESSAGES.length}`);
        console.log(`   📦 Orders: ${ORDERS.length}`);

        console.log('\n👤 Admin Credentials:');
        console.log('   📧 Email: admin@admin.com');
        console.log('   🔑 Password: admin123');
        console.log('\n   📧 Email: admin@teamzero.com');
        console.log('   🔑 Password: TeamZero@2026');

        console.log('\n📊 Admin Dashboard:');
        console.log('   🌐 http://localhost:5000/admin');
        console.log('════════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ SEED ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// ============================================================
// RUN SEED
// ============================================================

seedDatabase();