// ========================================
// TEAM ZERO - API CONFIG
// ========================================

(function() {
    'use strict';

    // رابط الـ Backend المنشور على Render.com
    const PRODUCTION_API_URL = 'https://teamzero-api.onrender.com/api';
    const DEVELOPMENT_API_URL = 'http://localhost:5000/api';

    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '';

    window.API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
    window.IS_DEVELOPMENT = isDevelopment;

    console.log('🌐 Config Loaded');
    console.log('📡 API URL:', window.API_BASE_URL);
    console.log('💻 Environment:', isDevelopment ? 'Development' : 'Production');

})();