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

        // 2. Insert into beneficiaries table
        const insertQuery = `
            INSERT INTO applications (
                first_name, middle_name, last_name, birthday, age,
                gender, civil_status, contact_number, occupation,
                monthly_income, valid_id_type, id_number,
                name_of_beneficiary, program_type, approval_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;  
        const insertValues = [
            app.first_name,
            app.middle_name,    
            app.last_name,
            app.birthday,
            app.age,    
            app.gender,
            app.civil_status,
            app.contact_number, 
            app.occupation,
            app.monthly_income,
            app.valid_id_type,  
            app.id_number,
            app.name_of_beneficiary,
            app.program_type
        ];
        await connection.execute(insertQuery, insertValues);

        // 3. Update application status to 'Approved'   
        const updateQuery = `
            UPDATE applications
            SET status = 'Approved', updated_at = NOW()
            WHERE id = ?
        `;
        await connection.execute(updateQuery, [id]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Reject application by ID with optional reason
exports.rejectApplication = async (id, ) => {
    const query = `
        UPDATE applications
        SET status = 'Rejected',  updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [id]);
};
