const db = require('../config/db');

// create new program
exports.createProgram = async (program) => {
  const { name, location, slots, budget, status } = program;
  const query = `
    INSERT INTO programs (program_name, location, slots, budget, status, filled, used)
    VALUES (?, ?, ?, ?, ?, 0, 0)
  `;
  const [result] = await db.execute(query, [name, location, slots, budget, status]);
  return result;
};

exports.getAllPrograms = async () => {
  const query = 'SELECT * FROM programs ORDER BY id DESC';
  const [rows] = await db.execute(query);
  return rows;
};

exports.getProgramsWithBeneficiaries = async () => {
  const query = `
    SELECT 
        p.id,
        p.program_name,
        p.location,
        p.slots,
        p.filled,
        p.budget,
        p.used,
        p.status,
        COUNT(CASE WHEN a.status = 'Approved' THEN 1 END) as approved_count
    FROM programs p
    LEFT JOIN applications a ON p.program_name = a.program_type
    GROUP BY p.id, p.program_name, p.location, p.slots, p.filled, p.budget, p.used, p.status
    ORDER BY p.id DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
};

exports.getProgramById = async (id) => {
  const query = 'SELECT * FROM programs WHERE id = ?';
  const [rows] = await db.execute(query, [id]);
  return rows;
};

exports.updateProgram = async (id, updated) => {
  const { name, location, slots, budget, status } = updated;
  const query = `
    UPDATE programs 
    SET program_name = ?, location = ?, slots = ?, budget = ?, status = ?
    WHERE id = ?
  `;
  const [result] = await db.execute(query, [name, location, slots, budget, status, id]);
  return result;
};

exports.deleteProgram = async (id) => {
  const query = 'DELETE FROM programs WHERE id = ?';
  const [result] = await db.execute(query, [id]);
  return result;
};