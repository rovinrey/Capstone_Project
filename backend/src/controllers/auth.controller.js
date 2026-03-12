const authService = require('../services/auth.services');

exports.signup = async (req, res) => {
    try {
        await authService.signup(req.body);
        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Signup controller Error:", error);
    }

};

exports.login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
        console.error("Login controller Error:", error);
    }
};
exports.getProfile = async (req, res) => {
    try {
        const data = await authService.getProfile(req.query.user_name);
        res.json(data);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }   
};