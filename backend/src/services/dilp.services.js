const db = require('../config/db');

// Apply to DILP program
exports.applyDilp = async (data) => {
    const query = `
        INSERT INTO dilp_applications (
            proponent_name, project_title, project_type, category,
            proposed_amount, location, contact_person, mobile_number,
            brief_description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const values = [
        data.proponent_name || '',
        data.project_title || '',
        data.project_type || 'Individual',
        data.category || 'Formation',
        data.proposed_amount || 0,
        data.location || '',
        data.contact_person || '',
        data.mobile_number || '',
        data.brief_description || ''
    ];

    try {
        const result = await db.execute(query, values);
        return result;
    } catch (err) {
        console.error("Database Error:", err.message);
        throw new Error("Failed to save DILP application.");
    }
};

// Get all DILP applications
exports.getDilpApplications = async (limit = 10) => {
    const query = `
        SELECT id, proponent_name, project_title, project_type, category,
               proposed_amount, location, mobile_number, status, created_at
        FROM dilp_applications 
        ORDER BY created_at DESC 
        LIMIT ?
    `;
    try {
        const result = await db.execute(query, [limit]);
        return result;
    } catch (err) {
        console.error("Database Error:", err.message);
        throw new Error("Failed to fetch DILP applications.");
    }
};

// Get DILP application by ID
exports.getDilpApplicationById = async (id) => {
    const query = `
        SELECT * FROM dilp_applications WHERE id = ?
    `;
    try {
        const result = await db.execute(query, [id]);
        return result;
    } catch (err) {
        console.error("Database Error:", err.message);
        throw new Error("Failed to fetch DILP application.");
    }
};

// Update DILP application status
exports.updateDilpStatus = async (id, status) => {
    const query = `
        UPDATE dilp_applications 
        SET status = ?, approval_date = ?
        WHERE id = ?
    `;
    const timestamp = status === 'Approved' ? new Date().toISOString() : null;
    
    try {
        const result = await db.execute(query, [status, timestamp, id]);
        return result;
    } catch (err) {
        console.error("Database Error:", err.message);
        throw new Error("Failed to update DILP application status.");
    }
};

// Get DILP applications by status
exports.getDilpApplicationsByStatus = async (status, limit = 10) => {
    const query = `
        SELECT id, proponent_name, project_title, project_type, category,
               proposed_amount, location, mobile_number, status, 
        FROM dilp_applications 
        WHERE status = ?
        ORDER BY created_at DESC 
        LIMIT ?
    `;
    try {
        const result = await db.execute(query, [status, limit]);
        return result;
    } catch (err) {
        console.error("Database Error:", err.message);
        throw new Error("Failed to fetch DILP applications by status.");
    }
};
``