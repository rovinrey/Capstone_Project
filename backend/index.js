const express = require('express');
const cors = require('cors');
const db = require('./src/config/db.js'); 
const formRoutes = require('./src/routes/form.routes.js');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // express.json() is the standard way to get json middleware

// --- SIGNUP ROUTE ---
app.post('/signup', async (req, res) => {
    const { email, phone, password, fullName } = req.body;

    try {
        const query = `
            INSERT INTO users (email, phone, password, fullName, role) 
            VALUES (?, ?, ?, ?, 'beneficiary')
        `;

        await db.execute(query, [
            email || null,
            phone || null,
            password,
            fullName
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

// --- SYSTEM ROUTES ---
app.use('/api/forms', formRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
});