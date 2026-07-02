// ========================================
// TEAM ZERO - CONTACT
// ========================================

(function() {
    'use strict';

    // ========================================
    // CONTACT FORM
    // ========================================
    class ContactForm {
        constructor(formId = 'contactForm') {
            this.form = document.getElementById(formId);
            this.init();
        }

        init() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Real-time validation
            this.form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearError(field));
            });
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'هذا الحقل مطلوب';
            }

            if (field.type === 'email' && value && !this.isValidEmail(value)) {
                isValid = false;
                errorMessage = 'البريد الإلكتروني غير صحيح';
            }

            if (field.type === 'tel' && value && !this.isValidPhone(value)) {
                isValid = false;
                errorMessage = 'رقم الهاتف غير صحيح';
            }

            if (!isValid) {
                this.showError(field, errorMessage);
            } else {
                this.clearError(field);
            }

            return isValid;
        }

        showError(field, message) {
            const parent = field.closest('.form-group');
            if (!parent) return;

            // Remove existing error
            this.clearError(field);

            // Add error message
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.cssText = `
                color: #ff6b6b;
                font-size: 0.85rem;
                margin-top: 0.3rem;
                font-weight: 600;
            `;
            error.textContent = message;

            parent.appendChild(error);
            field.style.borderColor = '#ff6b6b';
        }

        clearError(field) {
            const parent = field.closest('.form-group');
            if (!parent) return;

            const error = parent.querySelector('.error-message');
            if (error) error.remove();
            field.style.borderColor = '';
        }

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        isValidPhone(phone) {
            return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
        }

        handleSubmit() {
            // Validate all fields
            const fields = this.form.querySelectorAll('input, textarea, select');
            let isValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset form
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success
                this.showNotification('🎉 تم استلام رسالتك! سنتواصل معك في أقرب وقت.', 'success');

                // Log data (for debugging)
                console.log('📨 Form Data:', data);

                // Store in localStorage for admin
                this.storeMessage(data);
            }, 1500);
        }

        storeMessage(data) {
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({
                ...data,
                id: Date.now(),
                date: new Date().toISOString()
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
        }

        showNotification(message, type = 'success') {
            // Remove existing notifications
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 1rem 2rem;
                border-radius: var(--radius-sm);
                background: ${type === 'success' ? 'var(--gradient-main)' : '#ff6b6b'};
                color: white;
                font-weight: 600;
                max-width: 400px;
                z-index: 9999;
                animation: slideUp 0.5s ease;
                box-shadow: var(--shadow-glow);
                font-family: var(--font-arabic);
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Auto remove
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(20px)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    }

    // ========================================
    // WHATSAPP BUTTON
    // ========================================
    class WhatsAppButton {
        constructor(phone = '+966500000000', message = 'مرحباً، أريد استفسار عن خدماتكم') {
            this.phone = phone;
            this.message = encodeURIComponent(message);
            this.init();
        }

        init() {
            // Check if button exists
            const btn = document.querySelector('.whatsapp-float');
            if (btn) {
                btn.addEventListener('click', () => this.open());
                return;
            }

            // Create floating button
            const floatBtn = document.createElement('a');
            floatBtn.className = 'whatsapp-float';
            floatBtn.href = '#';
            floatBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 30px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #25D366;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                z-index: 999;
                transition: var(--transition);
                text-decoration: none;
                animation: bounce 2s ease-in-out infinite;
            `;
            floatBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
            floatBtn.setAttribute('aria-label', 'WhatsApp');
            floatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });

            document.body.appendChild(floatBtn);

            // Show after scroll
            floatBtn.style.opacity = '0';
            floatBtn.style.transform = 'scale(0)';
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    floatBtn.style.opacity = '1';
                    floatBtn.style.transform = 'scale(1)';
                } else {
                    floatBtn.style.opacity = '0';
                    floatBtn.style.transform = 'scale(0)';
                }
            });
        }

        open() {
            window.open(`https://wa.me/${this.phone}?text=${this.message}`, '_blank');
        }
    }

    // ========================================
    // MAP INTEGRATION
    // ========================================
    class MapIntegration {
        constructor(selector = '#map', lat = 24.7136, lng = 46.6753) {
            this.container = document.querySelector(selector);
            this.lat = lat;
            this.lng = lng;
            this.init();
        }

        init() {
            if (!this.container) return;

            // Create iframe with Google Maps
            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
                width: 100%;
                height: 100%;
                border: 0;
                border-radius: var(--radius-sm);
            `;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${this.lat},${this.lng}&zoom=15`;

            this.container.appendChild(iframe);
        }
    }

    // ========================================
    // INITIALIZE
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        // Contact Form
        new ContactForm();

        // WhatsApp Button
        new WhatsAppButton();

        // Map
        new MapIntegration();

        console.log('📬 Contact System Loaded');
    });

})();