// ========================================
// EMAIL UTILITY
// ========================================

const nodemailer = require('nodemailer');

// ===== Email Configuration =====
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ===== Send Email =====
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER || 'info@teamzero.com',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};

// ===== Send Contact Email =====
const sendContactEmail = async (data) => {
    const html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; direction: rtl; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6C3CE1, #4A9EFF); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #333; }
                .value { color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📨 رسالة جديدة من Team Zero</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">👤 الاسم:</div>
                        <div class="value">${data.name}</div>
                    </div>
                    <div class="field">
                        <div class="label">📧 البريد الإلكتروني:</div>
                        <div class="value">${data.email}</div>
                    </div>
                    <div class="field">
                        <div class="label">📱 رقم الهاتف:</div>
                        <div class="value">${data.phone || 'غير محدد'}</div>
                    </div>
                    <div class="field">
                        <div class="label">🔧 الخدمة المطلوبة:</div>
                        <div class="value">${data.service || 'غير محدد'}</div>
                    </div>
                    <div class="field">
                        <div class="label">💬 الرسالة:</div>
                        <div class="value">${data.message}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@teamzero.com',
        subject: `📨 رسالة جديدة من ${data.name}`,
        text: `رسالة من ${data.name}\nالبريد: ${data.email}\nالرسالة: ${data.message}`,
        html
    });
};

// ===== Send Welcome Email =====
const sendWelcomeEmail = async (email, name) => {
    const html = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; direction: rtl; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6C3CE1, #4A9EFF); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; }
                .btn { display: inline-block; background: linear-gradient(135deg, #6C3CE1, #4A9EFF); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 مرحباً بك في Team Zero!</h1>
                </div>
                <div class="content">
                    <p>مرحباً ${name}،</p>
                    <p>شكراً لتواصلك مع Team Zero. نحن سعداء باهتمامك بخدماتنا.</p>
                    <p>سنتواصل معك قريباً لمناقشة احتياجاتك بالتفصيل.</p>
                    <br>
                    <p>مع تحيات،</p>
                    <p><strong>فريق Team Zero</strong></p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return sendEmail({
        to: email,
        subject: '🎉 مرحباً بك في Team Zero',
        text: `مرحباً ${name}، شكراً لتواصلك معنا. سنتواصل معك قريباً.`,
        html
    });
};

module.exports = {
    sendEmail,
    sendContactEmail,
    sendWelcomeEmail
};