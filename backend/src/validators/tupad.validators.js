// validators/tupadValidator.js
exports.validateTupad = (req, res, next) => {
    const {
        first_name,
        last_name,
        date_of_birth,
        valid_id_type,
        id_number
    } = req.body;

    if (!first_name || !last_name || !date_of_birth) {
        return res.status(400).json({
            message: 'Name and birth date are required'
        });
    }

    if (!valid_id_type || !id_number) {
        return res.status(400).json({
            message: 'Valid ID is required'
        });
    }

    next();
};