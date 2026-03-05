const db = require('../config/db');

// apply for SPES
exports.applyToSpes = async (data) => {
    try {
        // 1. Format date (handling date_of_birth from frontend)
        const formattedBirthday = data.date_of_birth 
            ? new Date(data.date_of_birth).toISOString().split('T')[0] 
            : null;

        // 3. Single Insert into spes_applications
        const query = `
            INSERT INTO spes_applications (
                first_name, middle_name, last_name, date_of_birth, age, 
                gender, civil_status, address, contact_number, email,
                school, course, year_level, gwa,
                parent_name, parent_occupation, monthly_income, 
               program_type, applied_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            data.first_name || '',
            data.middle_name || null,
            data.last_name || '',
            formattedBirthday,
            data.age || null,
            data.gender || null,
            data.civil_status || null,
            data.address || null,
            data.contact_number || null,
            data.email || null,
            data.school || null,       // Mapped from school
            data.course || null,       // Mapped from course
            data.year_level || null,    // Mapped from yearLevel
            data.gwa || null,          // Mapped from gpa
            data.parent_name || null,
            data.parent_occupation || null,
            data.family_income || 0,   // Mapped from family_income         // Mapped from applied_at     
            'SPES'
        ];

        const [result] = await db.execute(query, values);
        
        return { success: true, insertId: result.insertId };
    } catch (error) {
        console.error("SPES Application Error:", error.message);
        throw error;
    }
};

// Apply to SPES program
exports.approveApplication = async (id) => {
    const connection = await db.getConnection(); 
    
    try {
        await connection.beginTransaction();

        // 1. Fetch the full applicant data
        const [rows] = await connection.execute(
            'SELECT * FROM spes_applications WHERE id = ?', 
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
            UPDATE spes_applications
            SET application_status = 'Approved', updated_at = NOW()
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
exports.rejectApplication = async (id, reason) => {
    const query = `
        UPDATE spes_applications
        SET application_status = 'Rejected', rejection_reason = ?, updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [reason, id]);
};