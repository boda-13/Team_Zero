// ========================================
// FILE CONTROLLER
// ========================================

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

// ===== Storage Configuration =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/files');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `file-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// ===== File Filter =====
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm',
        'application/pdf'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('نوع الملف غير مدعوم'), false);
    }
};

// ===== Upload Middleware =====
const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
    },
    fileFilter
});

// ===== File Store (In-memory for demo) =====
let files = [
    { id: 1, name: 'logo-team.png', type: 'image', size: '245 KB', date: new Date().toISOString(), path: 'logo-team.png' },
    { id: 2, name: 'banner-hero.jpg', type: 'image', size: '1.2 MB', date: new Date().toISOString(), path: 'banner-hero.jpg' },
    { id: 3, name: 'presentation.pdf', type: 'pdf', size: '2.8 MB', date: new Date().toISOString(), path: 'presentation.pdf' },
    { id: 4, name: 'promo-video.mp4', type: 'video', size: '8.5 MB', date: new Date().toISOString(), path: 'promo-video.mp4' },
    { id: 5, name: 'icon-512.png', type: 'image', size: '120 KB', date: new Date().toISOString(), path: 'icon-512.png' }
];

let nextFileId = 6;

// ===== Get All Files =====
exports.getAll = (req, res) => {
    const { type } = req.query;
    let filtered = files;
    if (type && type !== 'all') {
        filtered = files.filter(f => f.type === type);
    }
    res.json({
        success: true,
        files: filtered,
        total: filtered.length
    });
};

// ===== Upload File =====
exports.upload = [
    upload.single('file'),
    async(req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'يرجى اختيار ملف للرفع' });
            }

            const file = req.file;
            const fileType = getFileType(file.mimetype);
            const fileSize = formatFileSize(file.size);

            // Optimize image if it's an image
            let optimizedPath = file.path;
            if (fileType === 'image') {
                const ext = path.extname(file.originalname);
                const optimizedFilename = `optimized-${Date.now()}${ext}`;
                optimizedPath = path.join(path.dirname(file.path), optimizedFilename);

                await sharp(file.path)
                    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 80 })
                    .toFile(optimizedPath);

                // Remove original file
                fs.unlinkSync(file.path);
            }

            const newFile = {
                id: nextFileId++,
                name: file.originalname,
                type: fileType,
                size: fileSize,
                date: new Date().toISOString(),
                path: path.basename(optimizedPath)
            };

            files.unshift(newFile);

            res.status(201).json({
                success: true,
                message: 'تم رفع الملف بنجاح',
                file: newFile
            });

        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء رفع الملف' });
        }
    }
];

// ===== Delete File =====
exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    const index = files.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'الملف غير موجود' });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '../../uploads/files', files[index].path);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    files.splice(index, 1);
    res.json({
        success: true,
        message: 'تم حذف الملف بنجاح'
    });
};

// ===== Download File =====
exports.download = (req, res) => {
    const id = parseInt(req.params.id);
    const file = files.find(f => f.id === id);

    if (!file) {
        return res.status(404).json({ error: 'الملف غير موجود' });
    }

    const filePath = path.join(__dirname, '../../uploads/files', file.path);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'الملف غير موجود على الخادم' });
    }

    res.download(filePath, file.name);
};

// ===== Helper Functions =====
function getFileType(mimetype) {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype === 'application/pdf') return 'pdf';
    return 'other';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// ===== Seed Files (Optional) =====
exports.seedFiles = () => {
    // Initial files already defined above
    console.log('📁 Files initialized:', files.length);
};