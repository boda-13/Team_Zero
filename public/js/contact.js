
(function() {
    'use strict';

    const PRODUCTION_API_URL = 'https://teamzero-api.onrender.com/api';

    /**
     * رابط الـ Backend في بيئة التطوير المحلية
     */
    const DEVELOPMENT_API_URL = 'http://localhost:5000/api';

    /**
     * تحديد البيئة الحالية
     */
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '';

    /**
     * الرابط النهائي للـ API
     */
    const API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

    // ========================================
    // 2. تصدير المتغيرات
    // ========================================

    // تعيين المتغير في النافذة العامة
    window.API_BASE_URL = API_BASE_URL;
    window.IS_DEVELOPMENT = isDevelopment;

    // ========================================
    // 3. دوال مساعدة للـ API
    // ========================================

    /**
     * الحصول على التوكن من localStorage
     */
    window.getToken = function() {
        return localStorage.getItem('token');
    };

    /**
     * الحصول على بيانات المستخدم من localStorage
     */
    window.getCurrentUser = function() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    };

    /**
     * إجراء طلب API مع التوثيق التلقائي
     */
    window.apiRequest = async function(endpoint, options = {}) {
        const token = window.getToken();
        
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
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                // إذا كان التوكن منتهي الصلاحية
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (window.location.pathname !== '/login.html') {
                        window.location.href = '/login.html';
                    }
                    throw new Error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
                }
                throw new Error(data.error || 'حدث خطأ في الطلب');
            }
            
            return data;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    };

    /**
     * إجراء طلب GET
     */
    window.apiGet = async function(endpoint, options = {}) {
        return window.apiRequest(endpoint, { ...options, method: 'GET' });
    };

    /**
     * إجراء طلب POST
     */
    window.apiPost = async function(endpoint, data, options = {}) {
        return window.apiRequest(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    };

    /**
     * إجراء طلب PUT
     */
    window.apiPut = async function(endpoint, data, options = {}) {
        return window.apiRequest(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    };

    /**
     * إجراء طلب DELETE
     */
    window.apiDelete = async function(endpoint, options = {}) {
        return window.apiRequest(endpoint, { ...options, method: 'DELETE' });
    };

    // ========================================
    // 4. عرض معلومات التكوين في الكونسول
    // ========================================

    console.log('🌐 Team Zero Config Loaded');
    console.log(`📡 API URL: ${API_BASE_URL}`);
    console.log(`💻 Environment: ${isDevelopment ? 'Development' : 'Production'}`);
    console.log(`🔐 Auth Status: ${window.getToken() ? 'Logged In' : 'Logged Out'}`);

})();