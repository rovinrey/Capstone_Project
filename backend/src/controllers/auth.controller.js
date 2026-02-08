const authService = require('../services/auth.service').default;

exports.signup = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.status(201).json({ message: "User created!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const data = await authService.loginUser(req.body.email, req.body.password);
        res.json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};