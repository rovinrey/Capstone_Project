const db = require('../config/db');

exports.create = (data) => {
  const sql = `
    INSERT INTO applications (
      first_name,
      middle_name,
      last_name,
      birthday,
      age,
      gender,
      civil_status,
      contact_number,
      occupation,
      monthly_income,
      valid_id_type,
      id_number,
      name_of_beneficiary,
      program_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return db.query(sql, [
    data.first_name,
    data.middle_name,
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
    'TUPAD'
  ]);
};
