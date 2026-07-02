// ========================================
// AUTH ROUTES (Frontend Pages)
// ========================================

const express = require('express');
const router = express.Router();
const path = require('path');

// ===== Auth Pages =====
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

router.get('/logout', (req, res) => {
    res.redirect('/login');
});

module.exports = router;