// ========================================
// ADMIN ROUTES (Frontend Pages)
// ========================================

const express = require('express');
const router = express.Router();
const path = require('path');

// ===== Admin Pages =====
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

module.exports = router;