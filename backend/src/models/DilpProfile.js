const db = require('../config/db');

exports.create = async (data, programType = 'DILP') => {
  const sql = `
    INSERT INTO applications (
      first_name, middle_name, last_name, birthday, age, 
      gender, civil_status, contact_number, occupation, 
      monthly_income, valid_id_type, id_number, 
      name_of_beneficiary, program_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.first_name,
    data.middle_name || null, // Handle optional middle name
    data.last_name,
    data.birthday,
    data.age,
    data.gender,
    data.civil_status,
    data.contact_number,
    data.occupation,
    data.monthly_income,
    data.valid_id_type,
    data.id_number,
    data.name_of_beneficiary,
    programType
  ];

  try {
    const [result] = await db.query(sql, params);
    return result;
  } catch (err) {
    console.error("Database Error:", err.message);
    throw new Error("Failed to save application.");
  }
};
