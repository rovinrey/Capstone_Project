// tupad.services.js
const db = require('../config/db');

exports.applyToTupad = async (data) => {
    const query = `
        INSERT INTO tupad_applications (
            first_name, middle_name, last_name, date_of_birth, age, 
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
        'TUPAD'                      
    ];

    return await db.execute(query, values);
};
// approved tupad applications
exports.approveApplication = async (id) => {
    const connection = await db.getConnection(); 
    
    try {
        await connection.beginTransaction();

        // 1. Fetch the full applicant data
        const [rows] = await connection.execute(
            'SELECT * FROM tupad_applications WHERE id = ?', 
            [id]
        );

        if (rows.length === 0) {
            throw new Error('Application not found');
        }

        const app = rows[0];

        // 2. Insert into beneficiaries table
        // Defined 11 columns here:
        const insertQuery = `
            INSERT INTO beneficiaries (
                first_name, middle_name, last_name, extension_name,
                gender, civil_status, address, contact_number, 
                program_type, approval_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;  

        // You must provide exactly 10 values (the 11th is NOW())
        const insertValues = [
            app.first_name || null,
            app.middle_name || null,    
            app.last_name || null,
            app.extension_name || null,
            app.gender || null,
            app.civil_status || null,
            app.address || null, // Check: was app.address in your original app object?
            app.contact_number || null,
            app.program_type || null
        ];

        await connection.execute(insertQuery, insertValues);

        // 3. Update application status
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

// Reject application by ID with optional reason
exports.rejectApplication = async (id, ) => {
    const query = `
        UPDATE tupad_applications
        SET status = 'Rejected',  updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [id]);
};