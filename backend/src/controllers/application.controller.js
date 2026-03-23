const db = require('../config/db');
const ExcelJS = require('exceljs');
const tupadService = require('../services/tupad.services');
const dilpService = require('../services/dilp.services');
const spesService = require('../services/spes.services');
const beneficiaryService = require('../services/beneficiary.services');

// tupad application endpoint
exports.applyToTupad = async (req, res) => {
    try {
        const data = req.body;
        if (!data.user_id && req.user?.id) {
            data.user_id = req.user.id;
        }
        if (!data.user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }

        const result = await tupadService.applyTupad(data);
        res.status(201).json({ message: 'TUPAD application submitted', application_id: result.application_id });
    } catch (error) {
        console.error('TUPAD submission error:', error.message || error);
        res.status(500).json({ message: error.message || 'Error saving TUPAD application' });
    }
};

// Apply to SPES program
exports.applyToSpes = async (req, res) => {
    try {
        const result = await spesService.applyToSpes(req.body);
        res.status(201).json({ message: "SPES Application Success!", id: result.insertId });
        
    } catch (error) {
        console.error("SPES Application Error:", error.message);
        res.status(500).json({ message: "Error submitting SPES application", error: error.message });
    }
};

// Get SPES details by application ID
exports.getSpesDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const details = await spesService.getSpesDetails(applicationId);
        if (!details) {
            return res.status(404).json({ message: "SPES details not found" });
        }
        res.status(200).json(details);
    } catch (error) {
        console.error("Error fetching SPES details:", error.message);
        res.status(500).json({ message: "Error fetching SPES details", error: error.message });
    }
};

// Update SPES details
exports.updateSpesDetails = async (req, res) => {
    try {
        const { detailId } = req.params;
        const result = await spesService.updateSpesDetails(detailId, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "SPES details not found" });
        }
        res.status(200).json({ message: "SPES details updated successfully!" });
    } catch (error) {
        console.error("Error updating SPES details:", error.message);
        res.status(500).json({ message: "Error updating SPES details", error: error.message });
    }
};

// Create SPES details (for editing when details don't exist yet)
exports.createSpesDetails = async (req, res) => {
    try {
        const query = `
            INSERT INTO spes_details (
                application_id, gsis_beneficiary, place_of_birth, citizenship,
                social_media_account, status, sex, type_of_student, parent_status,
                is_pwd, is_senior_citizen, is_indigenous_people, is_displaced_worker, is_ofw_descendant,
                father_name, father_occupation, father_contact,
                mother_maiden_name, mother_occupation, mother_contact,
                education_level, name_of_school, degree_earned_course, year_level_grade, date_of_attendance,
                present_address, permanent_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.application_id,
            req.body.gsis_beneficiary || null,
            req.body.place_of_birth || null,
            req.body.citizenship || 'Filipino',
            req.body.social_media_account || null,
            req.body.status,
            req.body.sex,
            req.body.type_of_student,
            req.body.parent_status,
            req.body.is_pwd || false,
            req.body.is_senior_citizen || false,
            req.body.is_indigenous_people || false,
            req.body.is_displaced_worker || false,
            req.body.is_ofw_descendant || false,
            req.body.father_name || null,
            req.body.father_occupation || null,
            req.body.father_contact || null,
            req.body.mother_maiden_name || null,
            req.body.mother_occupation || null,
            req.body.mother_contact || null,
            req.body.education_level,
            req.body.name_of_school || null,
            req.body.degree_earned_course || null,
            req.body.year_level_grade || null,
            req.body.date_of_attendance || null,
            req.body.present_address || null,
            req.body.permanent_address || null
        ];

        const [result] = await db.execute(query, values);
        res.status(201).json({ message: "SPES details created successfully!", detailId: result.insertId });
    } catch (error) {
        console.error("Error creating SPES details:", error.message);
        res.status(500).json({ message: "Error creating SPES details", error: error.message });
    }
};


// Get recent applications
exports.getRecentApplications = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const userId = req.query.userId || req.user?.id || null;
        const [applications] = await beneficiaryService.getRecentApplications(limit, userId);
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
// Get all applications from all programs
exports.getAllApplications = async (req, res) => {
    try {
        const [applications] = await beneficiaryService.getAllApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching all applications:", error.message);
        res.status(500).json({ message: "Error fetching all applications", error: error.message });
    }
};

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
            const [applications] = await beneficiaryService.getAllApplications();
            return res.status(200).json(applications);
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

// approved tupad application 
exports.approvedTupadApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await tupadService.approveTupadApplication(id);
        res.status(200).json({ message: "Tupad application approved successfully!" });
    } catch (error) {
        console.error("Error approving Tupad Application", error.message);
        if (error.message === 'Application not found') {
            return res.status(404).json({ message: "TUPAD application not found" });
        }
        res.status(500).json({ message: "Error approving TUPAD application", error: error.message });
    }
};

// Get current beneficiary status summary + submissions history.
exports.getApplicationStatus = async (req, res) => {
    try {
        const userId = Number(req.query.userId || req.user?.id);
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const data = await beneficiaryService.getUserApplicationStatus(userId);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching application status:', error.message);
        res.status(500).json({ message: 'Error fetching application status', error: error.message });
    }
};

exports.exportApplications = async (req, res) => {
    try {
        const { programType } = req.query;
        const rows = await beneficiaryService.getApplicationsForExport(programType || null);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Applications');

        worksheet.columns = [
            { header: 'Application ID', key: 'id', width: 14 },
            { header: 'User ID', key: 'user_id', width: 10 },
            { header: 'Program Type', key: 'program_type', width: 14 },
            { header: 'First Name', key: 'first_name', width: 18 },
            { header: 'Middle Name', key: 'middle_name', width: 18 },
            { header: 'Last Name', key: 'last_name', width: 18 },
            { header: 'Contact Number', key: 'contact_number', width: 18 },
            { header: 'Address', key: 'address', width: 28 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Rejection Reason', key: 'rejection_reason', width: 24 },
            { header: 'Applied At', key: 'applied_at', width: 20 },
            { header: 'Approval Date', key: 'approval_date', width: 20 }
        ];

        rows.forEach((row) => worksheet.addRow(row));

        const safeProgram = (programType || 'all').toString().replace(/\s+/g, '_');
        const filename = `applications_${safeProgram}.xlsx`;

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting applications:', error.message);
        res.status(500).json({ message: 'Error exporting applications', error: error.message });
    }
};
