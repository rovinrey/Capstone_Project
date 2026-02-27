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
        'TUPAD'                      
    ];

    return await db.execute(query, values);
};
