const db = require('../config/db');

exports.applyTupad = async (data) => {
    const query = `
        INSERT INTO applications (
            first_name, middle_name, last_name, birthday, age, 
            gender, civil_status, contact_number, occupation, 
            monthly_income, valid_id_type, id_number, 
            name_of_beneficiary, program_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // MySQL expects DATE as 'YYYY-MM-DD'. 
    // If your React form sends 'MM/DD/YYYY', we need to convert it.
    const formattedBirthday = data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : null;

    const values = [
        data.first_name || '',        // Cannot be NULL
        data.middle_name || null, 
        data.last_name || '',         // Cannot be NULL
        formattedBirthday,            // Cannot be NULL
        data.age || null,
        data.gender || null,
        data.civil_status || null,
        data.contact_number || null,
        data.occupation || null,
        data.monthly_income || 0,
        data.valid_id_type || null,
        data.id_number || null,
        data.name_of_beneficiary || null,
        'TUPAD'                       // Hardcoded for this specific form
    ];

    return await db.execute(query, values);
};

// Get recent applications (limit 10)
exports.getRecentApplications = async (limit = 10) => {
    const query = `
        SELECT id, first_name, middle_name, last_name, program_type, 
               contact_number, occupation, monthly_income, status, applied_at
        FROM applications 
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
exports.approveApplication = async (id) => {
    const connection = await db.getConnection(); // Get connection for transaction
    
    try {
        await connection.beginTransaction();

        // 1. Fetch the full applicant data
        const [rows] = await connection.execute(
            'SELECT * FROM applications WHERE id = ?', 
            [id]
        );

        if (rows.length === 0) {
            throw new Error('Application not found');
        }

        const app = rows[0];

        // 2. Insert into the 'beneficiaries' table
        // Note: Map your application columns to your beneficiary table columns
        const insertQuery = `
            INSERT INTO beneficiaries (
                fullName, 
                phone, 
                email, 
                barangay_id, 
                program_type,
                approved_at
            ) VALUES (?, ?, ?, ?, ?, NOW())
        `;

        // Concatenate names for the fullName column in the beneficiary table
        const fullName = `${app.first_name} ${app.middle_name ? app.middle_name + ' ' : ''}${app.last_name}`;

        await connection.execute(insertQuery, [
            fullName,
            app.contact_number,
            app.email || null, // Ensure email exists or is null
            app.barangay_id || null, // The column we added earlier
            app.program_type
        ]);

        // 3. Update the status in the original applications table
        const updateQuery = `
            UPDATE applications
            SET status = 'Approved', 
                approval_date = NOW(), 
                updated_at = NOW() 
            WHERE id = ?
        `;
        await connection.execute(updateQuery, [id]);

        await connection.commit();
        return { success: true };

    } catch (error) {
        await connection.rollback();
        console.error("Approval Transaction Failed:", error.message);
        throw error;
    } finally {
        connection.release(); // Always release connection back to pool
    }
};
/*
exports.approveApplication = async (id) => {
    const query = `
        UPDATE applications
        SET status = 'Approved', approval_date = NOW(), updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [id]);
};
*/


// Reject application by ID with optional reason
exports.rejectApplication = async (id, reason = null) => {
    const query = `
        UPDATE applications
        SET status = 'Rejected', rejection_reason = ?, updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [reason, id]);
};
