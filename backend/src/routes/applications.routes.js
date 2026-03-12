const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get application status for each program for the logged-in user
router.get('/status', async (req, res) => {
    // TODO: Replace with actual user identification logic
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    try {
        // Example queries for each program
        const [tupad] = await db.query('SELECT status FROM tupad_applications WHERE user_id = ? ORDER BY applied_at DESC LIMIT 1', [userId]);
        const [spes] = await db.query('SELECT status FROM spes_applications WHERE user_id = ? ORDER BY applied_at DESC LIMIT 1', [userId]);
        const [dilp] = await db.query('SELECT status FROM dilp_applications WHERE user_id = ? ORDER BY applied_at DESC LIMIT 1', [userId]);

        res.json({
            TUPAD: tupad[0]?.status || null,
            SPES: spes[0]?.status || null,
            DILP: dilp[0]?.status || null,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching application status', error: err.message });
    }
});

module.exports = router;
