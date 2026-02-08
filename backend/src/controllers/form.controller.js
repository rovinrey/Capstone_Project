const beneficiaryService = require('../services/beneficiary.services');

exports.applyToProgram = async (req, res) => {
    try {
        // MUST match the name in your service file
        const [result] = await beneficiaryService.applyTupad(req.body); 
        
        res.status(201).json({ message: "Success!", id: result.insertId });
    } catch (error) {
        console.error("SQL Error Details:", error); // Check your terminal for the REAL error
        res.status(500).json({ message: "DB Error", error: error.sqlMessage });
    }
};