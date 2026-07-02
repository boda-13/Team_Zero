// ============================================================
// 🚀 TEAM ZERO - MAIN APPLICATION (FULL VERSION)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. USER AUTHENTICATION
    // ============================================================

    /**
     * الحصول على بيانات المستخدم من localStorage
     */
    function getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }

    /**
     * الحصول على التوكن من localStorage
     */
    function getToken() {
        return localStorage.getItem('token');
    }

    /**
     * التحقق من حالة تسجيل الدخول
     */
    function isLoggedIn() {
        return !!getToken() && !!getCurrentUser();
    }

    /**
     * التحقق من صلاحية المدير
     */
    function isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    }

    /**
     * التحقق من صلاحية المشرف
     */
    function isModerator() {
        const user = getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'moderator');
    }

    // ============================================================
    // 2. NAVBAR UPDATE
    // ============================================================

    /**
     * تحديث شريط التنقل بناءً على حالة المستخدم
     */
    function updateNavbar() {
        const token = getToken();
        const user = getCurrentUser();

        const navUserWrapper = document.getElementById('navUserWrapper');
        const authLinks = document.getElementById('authLinks');
        const navUserName = document.getElementById('navUserName');
        const navAvatar = document.getElementById('navAvatar');
        const adminLink = document.getElementById('adminLink');

        if (token && user) {
            if (navUserWrapper) navUserWrapper.style.display = 'block';
            if (authLinks) authLinks.style.display = 'none';

            if (navUserName) {
                navUserName.textContent = user.fullName || user.username || 'المستخدم';
            }

            if (navAvatar) {
                if (user.avatar) {
                    navAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                } else {
                    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '👤';
                    navAvatar.textContent = initial;
                    navAvatar.style.display = 'flex';
                    navAvatar.style.alignItems = 'center';
                    navAvatar.style.justifyContent = 'center';
                }
            }

            if (adminLink) {
                adminLink.style.display = user.role === 'admin' ? 'flex' : 'none';
            }
        } else {
            if (navUserWrapper) navUserWrapper.style.display = 'none';
            if (authLinks) authLinks.style.display = 'flex';
        }
    }

    // ============================================================
    // 3. NOTIFICATION SYSTEM
    // ============================================================

    /**
     * عرض إشعار للمستخدم
     */
    function showNotification(message, type = 'success', duration = 4000) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';

        const colors = {
            success: 'var(--gradient-main)',
            error: '#ff6b6b',
            warning: '#ffd93d',
            info: '#4A9EFF'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-sm, 12px);
            background: ${colors[type] || colors.success};
            color: ${type === 'warning' ? '#1a1a2e' : 'white'};
            font-weight: 600;
            max-width: 400px;
            z-index: 9999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 8px 40px rgba(0,0,0,0.3);
            font-family: var(--font-arabic, 'Cairo', sans-serif);
            display: flex;
            align-items: center;
            gap: 0.8rem;
            direction: rtl;
        `;

        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.success}" style="font-size: 1.2rem;"></i>
            <span>${message}</span>
            <button class="close-btn" style="
                background: none;
                border: none;
                color: ${type === 'warning' ? '#1a1a2e' : 'white'};
                cursor: pointer;
                font-size: 1.2rem;
                margin-right: auto;
                padding: 0 0.5rem;
            ">✕</button>
        `;

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                removeNotification(notification);
            });
        }

        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }

    /**
     * إزالة الإشعار
     */
    function removeNotification(notification) {
        if (!notification || !notification.parentElement) return;
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    // ============================================================
    // 4. USER DROPDOWN
    // ============================================================

    /**
     * إعداد قائمة المستخدم المنسدلة
     */
    function setupUserDropdown() {
        const navUserBtn = document.getElementById('navUserBtn');
        const userDropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminLink = document.getElementById('adminLink');

        if (navUserBtn && userDropdown) {
            navUserBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
                this.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (!navUserBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                    navUserBtn.classList.remove('active');
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && userDropdown.classList.contains('show')) {
                    userDropdown.classList.remove('show');
                    navUserBtn.classList.remove('active');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
            });
        }

        if (adminLink) {
            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'admin.html';
            });
        }
    }

    // ============================================================
    // 5. LOGOUT FUNCTION
    // ============================================================

    /**
     * تسجيل خروج المستخدم
     */
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateNavbar();
        showNotification('👋 تم تسجيل الخروج بنجاح', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // ============================================================
    // 6. API HELPER
    // ============================================================

    /**
     * إجراء طلب API مع التوثيق
     */
    async function apiRequest(endpoint, options = {}) {
        const token = getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    logoutUser();
                    throw new Error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
                }
                throw new Error(data.error || 'حدث خطأ في الطلب');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============================================================
    // 7. NAVIGATION
    // ============================================================

    /**
     * إعداد شريط التنقل
     */
    function setupNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        let lastScroll = 0;

        if (!navbar) return;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', function(e) {
                if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ============================================================
    // 8. BACK TO TOP BUTTON
    // ============================================================

    /**
     * إعداد زر العودة للأعلى
     */
    function setupBackToTop() {
        let backToTop = document.querySelector('.back-to-top');

        if (!backToTop) {
            backToTop = document.createElement('button');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTop.setAttribute('aria-label', 'العودة للأعلى');
            backToTop.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--gradient-main, linear-gradient(135deg, #6C3CE1, #4A9EFF));
                color: white;
                border: none;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                box-shadow: 0 8px 40px rgba(108, 60, 225, 0.3);
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            document.body.appendChild(backToTop);
        }

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                backToTop.style.transform = 'translateY(20px)';
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================================
    // 9. STATS COUNTER
    // ============================================================

    /**
     * تفعيل عداد الإحصائيات عند التمرير
     */
    function setupStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        if (!stats.length) return;

        let animated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateStats(stats);
                    animated = true;
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.getElementById('stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    /**
     * تشغيل حركة العداد
     */
    function animateStats(stats) {
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            if (!target || isNaN(target)) return;

            let current = 0;
            const duration = 2000;
            const steps = 60;
            const increment = Math.ceil(target / steps);
            const stepTime = duration / steps;

            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                stat.textContent = current;
            }, stepTime);
        });
    }

    // ============================================================
    // 10. FAQ ACCORDION
    // ============================================================

    /**
     * إعداد أسئلة شائعة قابلة للطي
     */
    function setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ============================================================
    // 11. SMOOTH SCROLL
    // ============================================================

    /**
     * إعداد التمرير السلس للروابط الداخلية
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================================
    // 12. ACTIVE LINK
    // ============================================================

    /**
     * تحديث الرابط النشط حسب الموقع
     */
    function setupActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const cleanHref = href.replace(/^\//, '');
            const cleanPath = currentPath.replace(/^\//, '');

            if (cleanHref === cleanPath ||
                (cleanHref === 'index.html' && (cleanPath === '' || cleanPath === 'index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================================
    // 13. PARALLAX EFFECT
    // ============================================================

    /**
     * تفعيل تأثير البارالاكس
     */
    function setupParallax() {
        const elements = document.querySelectorAll('[data-parallax]');
        if (!elements.length) return;

        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // ============================================================
    // 14. INITIALIZE
    // ============================================================

    /**
     * تهيئة جميع الوظائف عند تحميل الصفحة
     */
    document.addEventListener('DOMContentLoaded', function() {
        updateNavbar();
        setupUserDropdown();
        setupNavigation();
        setupBackToTop();
        setupStatsCounter();
        setupFAQ();
        setupSmoothScroll();
        setupActiveLink();
        setupParallax();

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }

        console.log('🚀 Team Zero - Application Loaded Successfully');
        console.log('👤 User:', getCurrentUser() ? getCurrentUser().fullName || 'Guest' : 'Guest');
        console.log('🔐 Status:', isLoggedIn() ? 'Logged In' : 'Logged Out');
    });

    // ============================================================
    // 15. EXPOSE TO GLOBAL
    // ============================================================

    window.TeamZero = {
        getCurrentUser,
        getToken,
        isLoggedIn,
        isAdmin,
        isModerator,
        updateNavbar,
        showNotification,
        logoutUser,
        apiRequest
    };

    window.showNotification = showNotification;
    window.updateNavbar = updateNavbar;
    window.logoutUser = logoutUser;

})();