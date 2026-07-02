// ========================================
// CONTACT CONTROLLER
// ========================================

const db = require('../models/db');

exports.getAll = (req, res) => {
    res.json(db.get('messages'));
};

exports.create = (req, res) => {
    const message = db.add('messages', {
        ...req.body,
        date: new Date().toISOString()
    });
    res.status(201).json(message);
};

exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = db.delete('messages', id);
    if (!deleted) {
        return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
};