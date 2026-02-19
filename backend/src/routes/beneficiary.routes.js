const express = require('express');
const router = express.Router();
const db = require('../config/db.js');

// In basic JS, we remove the "Request" and "Response" type definitions
router.get('/', async (req, res) => {
    try {
        // return all beneficiaries (approved applicants)
        const [rows] = await db.query('SELECT * FROM beneficiaries');
        res.json(rows);
    } catch (err) {
        console.error("❌ FETCH ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// return total number of beneficiaries for dashboard stats
router.get('/count', async (req, res) => {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM beneficiaries');
        res.json({ count });
    } catch (err) {
        console.error("❌ COUNT ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;