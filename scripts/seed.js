// ========================================
// SEED DATABASE - UPDATED
// ========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Team = require('../models/Team');
const Message = require('../models/Message');
const Order = require('../models/Order');
const Review = require('../models/Review');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teamzero');

        console.log('🗑️  Clearing database...');

        await User.deleteMany({});
        await Project.deleteMany({});
        await Service.deleteMany({});
        await Team.deleteMany({});
        await Message.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});

        console.log('📝 Seeding users...');

        // ===== ADMIN USER (BASIC) =====
        const adminPassword = await bcrypt.hash('admin123', 12);
        const admin = new User({
            username: 'admin',
            email: 'admin@admin.com',
            password: adminPassword,
            fullName: 'مدير النظام',
            role: 'admin',
            emailVerified: true,
            isActive: true
        });
        await admin.save();
        console.log('✅ Admin created: admin@admin.com / admin123');

        // ===== ADMIN USER (SECONDARY) =====
        const admin2Password = await bcrypt.hash('TeamZero@2026', 12);
        const admin2 = new User({
            username: 'teamzero',
            email: 'admin@teamzero.com',
            password: admin2Password,
            fullName: 'Team Zero Admin',
            role: 'admin',
            emailVerified: true,
            isActive: true
        });
        await admin2.save();
        console.log('✅ Admin created: admin@teamzero.com / TeamZero@2026');

        // ===== MODERATOR =====
        const modPassword = await bcrypt.hash('moderator123', 12);
        const moderator = new User({
            username: 'moderator',
            email: 'moderator@admin.com',
            password: modPassword,
            fullName: 'مشرف المحتوى',
            role: 'moderator',
            emailVerified: true,
            isActive: true
        });
        await moderator.save();
        console.log('✅ Moderator created: moderator@admin.com / moderator123');

        console.log('📝 Seeding projects...');

        const projects = [
            {
                title: 'شركة تكنو',
                category: 'web',
                description: 'موقع شركة تقنية متكامل يقدم حلولاً برمجية مبتكرة',
                shortDescription: 'موقع شركة تقنية متكامل',
                featured: true,
                status: 'completed',
                client: 'شركة تكنو',
                technologies: ['React', 'Node.js', 'MongoDB']
            },
            {
                title: 'متجر زيتونة',
                category: 'web',
                description: 'متجر إلكتروني متكامل للمنتجات الطبيعية والعضوية',
                shortDescription: 'متجر إلكتروني للمنتجات الطبيعية',
                featured: true,
                status: 'completed',
                client: 'زيتونة',
                technologies: ['Vue.js', 'Laravel', 'MySQL']
            },
            {
                title: 'هوية براند',
                category: 'design',
                description: 'هوية بصرية متكاملة لعلامة تجارية متميزة',
                shortDescription: 'هوية بصرية متكاملة',
                featured: true,
                status: 'completed',
                client: 'براند',
                technologies: ['Adobe Illustrator', 'Photoshop', 'Figma']
            },
            {
                title: 'إعلان تسويقي',
                category: 'video',
                description: 'فيديو إعلاني احترافي بجودة عالية',
                shortDescription: 'فيديو إعلاني احترافي',
                featured: false,
                status: 'completed',
                client: 'شركة تسويق',
                technologies: ['Premiere Pro', 'After Effects']
            }
        ];

        for (const project of projects) {
            await new Project(project).save();
        }
        console.log('✅ Projects seeded:', projects.length);

        console.log('📝 Seeding services...');

        const services = [
            {
                name: 'تطوير المواقع',
                description: 'نبني مواقع احترافية متجاوبة بأحدث التقنيات',
                shortDescription: 'مواقع شركات، متاجر إلكترونية، لوحات تحكم',
                icon: '💻',
                features: ['مواقع شركات', 'متاجر إلكترونية', 'لوحات تحكم', 'أنظمة مخصصة'],
                category: 'web',
                order: 1
            },
            {
                name: 'التصميم الإبداعي',
                description: 'هويات بصرية وتصاميم مميزة تعكس شخصية علامتك',
                shortDescription: 'شعارات، هوية بصرية، تصاميم سوشيال ميديا',
                icon: '🎨',
                features: ['Logo Design', 'Brand Identity', 'Social Media', 'UI/UX'],
                category: 'design',
                order: 2
            },
            {
                name: 'المونتاج والإنتاج',
                description: 'محتوى بصري احترافي يجذب الجمهور',
                shortDescription: 'مونتاج ألعاب، ريلز، فيديوهات يوتيوب',
                icon: '🎬',
                features: ['Gaming Montage', 'Reels & Shorts', 'YouTube Videos', 'Motion Graphics'],
                category: 'video',
                order: 3
            }
        ];

        for (const service of services) {
            await new Service(service).save();
        }
        console.log('✅ Services seeded:', services.length);

        console.log('📝 Seeding team...');

        const team = [
            {
                name: 'أحمد محمد',
                role: 'المدير التنفيذي',
                icon: '👨‍💻',
                status: 'نشط',
                social: { linkedin: '#', github: '#', twitter: '#' },
                bio: 'خبرة 10 سنوات في مجال التقنية والقيادة'
            },
            {
                name: 'سارة خالد',
                role: 'مصممة UI/UX',
                icon: '🎨',
                status: 'نشط',
                social: { linkedin: '#', github: '#', behance: '#' },
                bio: 'مصممة إبداعية مع شغف بالتفاصيل'
            },
            {
                name: 'محمد علي',
                role: 'مطور Full Stack',
                icon: '⚡',
                status: 'نشط',
                social: { linkedin: '#', github: '#', dev: '#' },
                bio: 'مطور متمرس في بناء التطبيقات المتكاملة'
            },
            {
                name: 'نورا إبراهيم',
                role: 'مونتير ومخرج',
                icon: '🎬',
                status: 'نشط',
                social: { linkedin: '#', youtube: '#', vimeo: '#' },
                bio: 'مخرجة ومونتيرة محترفة في صناعة المحتوى'
            }
        ];

        for (const member of team) {
            await new Team(member).save();
        }
        console.log('✅ Team seeded:', team.length);

        console.log('📝 Seeding reviews...');

        const reviews = [
            {
                name: 'خالد العتيبي',
                rating: 5,
                title: 'خدمة ممتازة',
                content: 'فريق Team Zero قام بعمل رائع في تصميم موقعنا، أنصح بهم بشدة.',
                status: 'approved',
                verified: true
            },
            {
                name: 'أحمد السليمان',
                rating: 4,
                title: 'عمل احترافي',
                content: 'تعامل راقي وجودة عالية في التصميم، سعيد بالنتيجة النهائية.',
                status: 'approved',
                verified: true
            }
        ];

        for (const review of reviews) {
            await new Review(review).save();
        }
        console.log('✅ Reviews seeded:', reviews.length);

        console.log('\n═══════════════════════════════════════════════════');
        console.log('✅ Database seeded successfully!');
        console.log('═══════════════════════════════════════════════════');
        console.log('\n👤 Admin Credentials (BASIC):');
        console.log('\n📊 Dashboard: http://localhost:5000/admin');
        console.log('═══════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedDatabase();