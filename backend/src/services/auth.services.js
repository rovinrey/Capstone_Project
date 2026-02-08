const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming db.js exports the connection/pool

const registerUser = async (userData) => {
    const { fullName, email, password, role } = userData;
    
    // Using bcrypt.hash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
        'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [fullName, email, hashedPassword, role]
    );
    return result;  
};

const loginUser = async (email, password) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Using bcrypt.compare
    if (user && await bcrypt.compare(password, user.password)) {
        // Using jwt.sign
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'your_secret_key', 
            { expiresIn: '1d' }
        );
        return { token, role: user.role, name: user.full_name };
    }
    throw new Error('Invalid credentials');
};

// --- EXPORTING ---
module.exports = { 
    registerUser, 
    loginUser 
};