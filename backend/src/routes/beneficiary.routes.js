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
        const [rows] = await db.query('SELECT program_type, COUNT(*) as count FROM beneficiaries GROUP BY program_type');
        res.json(rows);
    } catch (err) {
        console.error("❌ COUNT ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;