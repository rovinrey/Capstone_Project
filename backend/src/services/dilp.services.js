const db = require("../config/db");

// Apply to DILP program
exports.applyDilp = async (data) => {
    const query = `
        INSERT INTO dilp_applications (
            proponent_name, sex, civil_status, date_of_birth,
            email, project_title, project_type, category,
            proposed_amount, location, barangay, city, province, contact_person, 
            contact_number, business_expercience, estimated_monthly_income,
            number_of_beneficiaries, skills_training, valid_id_number, brief_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.proponent_name,
        data.sex,
        data.civil_status,
        data.date_of_birth,
        data.email,
        data.project_title,
        data.project_type,
        data.category,
        data.proposed_amount,
        data.location,
        data.barangay,
        data.city,
        data.province,
        data.contact_person,
        data.contact_number,
        data.business_expercience,
        data.estimated_monthly_income,
        data.number_of_beneficiaries,
        data.skills_training,
        data.valid_id_number,
        data.brief_description,
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
    const timestamp = status === "Approved" ? new Date().toISOString() : null;

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
``;
