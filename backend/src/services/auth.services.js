const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming db.js exports the connection/pool

// --- SIGNUP FUNCTION ---
const signup = async (body) => {
    const { user_name, identifier, password, role } = body;
    
    // Handle identifier: determine if it's email or phone
    let email = null;
    let phone = null;
    
    if (!user_name || !identifier || !password) {
        throw new Error("All fields are required");
    }
    
    // Simple validation: if contains @, treat as email, otherwise as phone
    if (identifier.includes('@')) {
        email = identifier;
    } else {
        phone = identifier;
    }

    if (!email && !phone) {
        throw new Error("Please provide a valid email or phone number");
    }

    try {
        // Check if email or phone already exists
        const [existingUsers] = await db.execute(
            'SELECT user_id FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );
        if (existingUsers.length > 0) {
            throw new Error("Email or phone number already in use");
        }
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert new user into the database
        await db.execute(
            'INSERT INTO users (user_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [user_name, email || null, phone || null, hashedPassword, 'beneficiary']
        );
        return { message: "Account created successfully!" };
    } catch (error) {
        console.error("❌ SIGNUP ERROR:", error.message);
        throw error;
    }   
};

// --- LOGIN FUNCTION ---
const login = async (body) => {
    const identifier = body.identifier || body.email || null;
    const password = body.password || null;

    if (!identifier || !password) {
        throw new Error("Email/Phone and Password are required");
    }

    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            throw new Error("Account not found");
        }

        const user = users[0];

        // Compare password with hashed password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, user_name: user.user_name, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            return {
                message: "Login successful!",
                token,
                role: user.role,
                user: { 
                    id: user.id, 
                    user_name: user.user_name,
                    email: user.email,
                    phone: user.phone
                }
            };
        } else {
            throw new Error("Incorrect password");
        }
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error.message);
        throw error;
    }
};

// get the usetname of the user who logged in
const getProfile = async (userId) => {
    try {
        const [users] = await db.execute(
            'SELECT user_id, user_name, email, phone, role FROM users WHERE user_id = ?',
            [userId]
        );
        if (users.length === 0) {
            throw new Error("User not found");
        }   
        return users[0];
    } catch (error) {
        console.error("❌ GET PROFILE ERROR:", error.message);
        throw error;
    }   
};

// --- EXPORTING ---
module.exports = { 
    signup, 
    login,
    getProfile
};