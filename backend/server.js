const express = require('express');
const cors = require('cors');
const db = require('./src/config/db.js'); 
const formRoutes = require('./src/routes/form.routes.js');
const programRoutes = require('./src/routes/program.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');
const beneficiaryRoutes = require('./src/routes/beneficiary.routes.js');

// --- MIDDLEWARE ---
const app = express();
app.use(cors());

app.use(express.json()); // express.json() is the standard way to get json middleware

app.use('/api/auth', authRoutes); // This will handle both /signup and /login routes


// --- LOGOUT ROUTE ---
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