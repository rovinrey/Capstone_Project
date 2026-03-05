const db = require('../config/db');

// this beneficiary.services handles the fetching of recent applications and approval/rejection logic for the admin dashboard

// Get recent applications (limit 10)
exports.getRecentApplications = async (limit = 10) => {
    const query = `
        SELECT id, first_name, middle_name, last_name, program_type, 
               contact_number, occupation, monthly_income, status, applied_at
        FROM applications 
        where status = 'Pending'
        ORDER BY applied_at DESC 
        LIMIT ?
    `;
    return await db.execute(query, [limit]);
};

// --- approval & status helpers ---

exports.getPendingApplications = async () => {
    const query = `
        SELECT * FROM applications
        WHERE status = 'Pending'
        ORDER BY applied_at DESC
    `;
    return await db.execute(query);
};


// Get applications by status (Pending, Approved, Rejected)
exports.getApplicationsByStatus = async (status) => {
    const query = `
        SELECT * FROM applications
        WHERE status = ?
        ORDER BY applied_at DESC
    `;
    return await db.execute(query, [status]);
};

// Approve application by ID


