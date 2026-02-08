const express = require('express');
const router = express.Router();
const db = require('../config/db.js');

// In basic JS, we remove the "Request" and "Response" type definitions
router.get('/', async (req, res) => {
    try {
        // Use db.execute or db.query depending on your mysql2 setup
        const [rows] = await db.query('SELECT * FROM beneficiaries');
        res.json(rows);
    } catch (err) {
        // Changed 'any' to 'err' so the variable exists for your message
        console.error("❌ FETCH ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;