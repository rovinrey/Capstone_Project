const db = require('../config/db');

// apply for SPES
exports.applySpes = async (data) => {
    try {
        // Step 1: Format birthday
        const formattedBirthday = data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : null;

        // Step 2: Insert into applications table
        const applicationQuery = `
            INSERT INTO applications (
                first_name, middle_name, last_name, birthday, age, 
                gender, civil_status, contact_number, occupation, 
                monthly_income, valid_id_type, id_number, 
                name_of_beneficiary, program_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const applicationValues = [
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
            'SPES'  // Program type is always SPES
        ];

        const [applicationResult] = await db.execute(applicationQuery, applicationValues);
        const applicationId = applicationResult.insertId;

        // Step 3: Get program_id from programs table
        const [programRows] = await db.execute(
            'SELECT id FROM programs WHERE program_name = ?',
            ['SPES']
        );

        const programId = programRows.length > 0 ? programRows[0].id : null;

        // Step 4: Insert SPES-specific details into spes_applications
        const spesQuery = `
            INSERT INTO spes_applications (
                application_id, program_id, school_name, course_year, gwa
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const spesValues = [
            applicationId,
            programId,
            data.school_name || null,
            data.course_year || null,
            data.gwa || null
        ];

        const [spesResult] = await db.execute(spesQuery, spesValues);

        return [{ insertId: applicationId }];
    } catch (error) {
        console.error("SPES Application Error:", error.message);
        throw error;
    }
};