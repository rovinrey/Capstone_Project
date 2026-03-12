// tupad.services.js
const db = require('../config/db');

// 1. Apply to TUPAD
exports.applyToTupad = async (data) => {
    const query = `
        INSERT INTO tupad_applications (
            first_name, middle_name, last_name, date_of_birth, age, 
            gender, civil_status, contact_number, occupation, 
            monthly_income, valid_id_type, id_number, 
            name_of_beneficiary, program_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Careful with timezone shifts here. If it's already 'YYYY-MM-DD', just pass it directly!
    const formattedBirthday = data.date_of_birth 
        ? new Date(data.date_of_birth).toISOString().split('T')[0] 
        : null;

    const values = [
        data.first_name || '',        
        data.middle_name || null, 
        data.last_name || '',         
        formattedBirthday,            
        data.age || null,
        data.gender || null,
        data.civil_status || null,
        data.contact_number || null,
        data.occupation || null,
        data.monthly_income || 0,
        data.valid_id_type || null,
        data.id_number || null,
        data.name_of_beneficiary || null,
        'TUPAD'                      
    ];

    return await db.execute(query, values);
};
// 2. Approve Application
exports.approveTupadApplication = async (id) => {
    const connection = await db.getConnection(); 
    
    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            'SELECT * FROM tupad_applications WHERE id = ?', 
            [id]
        );

        if (rows.length === 0) throw new Error('Application not found');
        const app = rows[0];

        // Handle missing address and extension_name gracefully
        const insertQuery = `
            INSERT INTO beneficiaries (
                id, first_name, middle_name, last_name, extension_name,
                gender, civil_status, address, contact_number, 
                program_type, approval_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const insertValues = [
            app.id,
            app.first_name,
            app.middle_name,
            app.last_name,
            app.extension_name || null,
            app.gender,
            app.civil_status,
            app.address || app.barangay || app.city || app.province || 'N/A',
            app.contact_number,
            app.program_type || 'TUPAD'
        ];

        await connection.execute(insertQuery, insertValues);

        // Update application status
        const updateQuery = `
            UPDATE tupad_applications
            SET status = 'Approved', updated_at = NOW()
            WHERE id = ?
        `;
        await connection.execute(updateQuery, [id]);

        await connection.commit();
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Database Error Detail:", error.message);
        throw error; 
    } finally {
        if (connection) connection.release();
    }
};
// 3. Reject Application
// FIXED: Removed trailing comma, added 'reason' parameter
exports.rejectApplication = async (id, reason = null) => {
    // If you have a remarks/reason column, you can add it here.
    const query = `
        UPDATE tupad_applications
        SET status = 'Rejected', updated_at = NOW()
        -- You could add: , remarks = ? here if you track reasons
        WHERE id = ?
    `;
    
    // If you add remarks to the query, remember to add 'reason' to this array
    return await db.execute(query, [id]); 
};