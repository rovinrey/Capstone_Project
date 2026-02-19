const express = require('express');
const cors = require('cors');
const db = require('./src/config/db.js'); 
const formRoutes = require('./src/routes/form.routes.js');
const programRoutes = require('./src/routes/program.routes.js');
// new beneficiary route to expose approved applications as beneficiaries
const beneficiaryRoutes = require('./src/routes/beneficiary.routes.js');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // express.json() is the standard way to get json middleware

// --- SIGNUP ROUTE ---
app.post('/signup', async (req, res) => {
    const { email, phone, password, fullName } = req.body;
    // allow optional role (admin/staff/beneficiary) when creating users
    const role = req.body.role || 'beneficiary';

    try {
        const query = `
            INSERT INTO users (email, phone, password, fullName, role) 
            VALUES (?, ?, ?, ?, 'beneficiary')
        `;

        // use parameterized role instead of hardcoded string
        const finalQuery = `
            INSERT INTO users (email, phone, password, fullName, role) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(finalQuery, [
            email || null,
            phone || null,
            password,
            fullName,
            role
        ]);

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.error("❌ SIGNUP ERROR:", error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email or Phone already exists." });
        }
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

// --- LOGIN ROUTE ---
app.post('/login', async (req, res) => {
    const identifier = req.body.identifier || req.body.email || null;
    const password = req.body.password || null;

    if (!identifier || !password) {
        return res.status(400).json({ message: "Email/Phone and Password are required" });
    }

    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        const user = users[0];

        if (user.password === password) {
            res.status(200).json({
                message: "Login successful!",
                role: user.role,
                user: { id: user.id, fullName: user.fullName }
            });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// --- LOGOUT ROUTE ---
// simple endpoint to handle client logout requests. because we use
// JWTs and store everything in localStorage there is nothing to clear
// server‑side, but exposing a route allows the frontend to hit it if
// needed (e.g. to clear cookies or for audit logging in the future).
app.post('/logout', (req, res) => {
    // if session or cookies were used we'd destroy them here
    res.status(200).json({ message: 'Logged out' });
});

// --- SYSTEM ROUTES ---
app.use('/api/forms', formRoutes);
app.use('/api/programs', programRoutes);
// expose beneficiaries endpoint so frontend can fetch approved applicants
app.use('/api/beneficiaries', beneficiaryRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
});