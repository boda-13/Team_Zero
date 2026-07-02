// ========================================
// ADMIN UI ROUTES
// ========================================

const express = require('express');
const router = express.Router();
const path = require('path');
const { authenticate, isAdmin } = require('../middleware/auth');

// ===== Admin Pages (All require authentication) =====
router.use('/admin/*', authenticate);

// ===== Admin Dashboard =====
router.get('/admin', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/dashboard', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/projects', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/services', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/users', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/messages', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/orders', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/settings', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/analytics', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

router.get('/admin/files', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin.html'));
});

// ===== Redirect if not authenticated =====
router.get('/admin/*', (req, res) => {
    res.redirect('/login');
});

module.exports = router;