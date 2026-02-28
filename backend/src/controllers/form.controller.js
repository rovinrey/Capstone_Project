const beneficiaryService = require('../services/beneficiary.services');
const dilpService = require('../services/dilp.services');
const spesService = require('../services/spes.services');

exports.applyToTupad = async (req, res) => {
    try {
        // MUST match the name in your service file
        const [result] = await beneficiaryService.applyTupad(req.body); 
        
        res.status(201).json({ message: "TUPAD Application Success!", id: result.insertId });
    } catch (error) {
        console.error("SQL Error Details:", error); // Check your terminal for the REAL error
        res.status(500).json({ message: "DB Error", error: error.sqlMessage });
    }
};

// Apply to SPES program
exports.applyToSpes = async (req, res) => {
    try {
        const [result] = await spesService.applySpes(req.body);
        res.status(201).json({ message: "SPES Application Success!", id: result.insertId });
    } catch (error) {
        console.error("SPES Application Error:", error.message);
        res.status(500).json({ message: "Error submitting SPES application", error: error.message });
    }
};

// Apply to DILP program
exports.applyToDilp = async (req, res) => {
    try {
        const [result] = await dilpService.applyDilp(req.body);
        res.status(201).json({ message: "Success!", id: result.insertId });
    } catch (error) {
        console.error("DILP Error:", error);
        res.status(500).json({ message: "Error submitting DILP application", error: error.message });
    }
};

// Get recent applications
exports.getRecentApplications = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const [applications] = await beneficiaryService.getRecentApplications(limit);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching recent applications:", error.message);
        res.status(500).json({ message: "Error fetching recent applications", error: error.message });
    }
};

// Get recent DILP applications
exports.getRecentDilpApplications = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const [applications] = await dilpService.getDilpApplications(limit);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching DILP applications:", error.message);
        res.status(500).json({ message: "Error fetching DILP applications", error: error.message });
    }
};

// Get DILP application by ID
exports.getDilpApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [application] = await dilpService.getDilpApplicationById(id);
        if (!application || application.length === 0) {
            return res.status(404).json({ message: "DILP application not found" });
        }
        res.status(200).json(application[0]);
    } catch (error) {
        console.error("Error fetching DILP application:", error.message);
        res.status(500).json({ message: "Error fetching DILP application", error: error.message });
    }
};

// Update DILP application status
exports.updateDilpStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        await dilpService.updateDilpStatus(id, status);
        res.status(200).json({ message: "DILP application status updated successfully" });
    } catch (error) {
        console.error("Error updating DILP application:", error.message);
        res.status(500).json({ message: "Error updating DILP application", error: error.message });
    }
};

// --- Application approval endpoints (beneficiary) ---

// fetch all pending applications
exports.getPendingApplications = async (req, res) => {
    try {
        const [applications] = await beneficiaryService.getPendingApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error getting pending apps:", error.message);
        res.status(500).json({ message: "Error fetching pending applications", error: error.message });
    }
};

// fetch apps filtered by status (query ?status=)
exports.getApplicationsByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
            return res.status(400).json({ message: "Status query parameter required" });
        }
        const [applications] = await beneficiaryService.getApplicationsByStatus(status);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error getting applications by status:", error.message);
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

// approve specific application by id
exports.approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await beneficiaryService.approveApplication(id);
        res.status(200).json({ message: "Application approved successfully" });
    } catch (error) {
        console.error("Error approving application:", error.message);
        res.status(500).json({ message: "Error approving application", error: error.message });
    }
};

// reject application with optional reason in body
exports.rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        await beneficiaryService.rejectApplication(id, reason);
        res.status(200).json({ message: "Application rejected successfully" });
    } catch (error) {
        console.error("Error rejecting application:", error.message);
        res.status(500).json({ message: "Error rejecting application", error: error.message });
    }
};
