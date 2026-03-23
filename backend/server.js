require('dotenv').config();
const express = require('express');
const cors = require('cors');
// --- ROUTES ---

const programRoutes = require('./src/routes/program.routes.js');
const authRoutes = require('./src/routes/auth.routes.js');
const beneficiaryRoutes = require('./src/routes/beneficiary.routes.js');
const applicationsRoutes = require('./src/routes/application.routes.js');
const attendanceRoutes = require('./src/routes/attendance.routes.js');

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
app.use('/api/tupad', require('./src/routes/tupad.routes.js')); // TUPAD-specific routes
app.use('/api/forms', applicationsRoutes); // This will handle all application-related routes
app.use('/api/programs', programRoutes);
// expose beneficiaries endpoint so frontend can fetch approved applicants
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
});