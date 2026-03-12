const db = require("../config/db");
// Get all applications from all programs
exports.getAllApplications = async () => {
  const query = `
    SELECT id, first_name, middle_name, last_name, program_type, contact_number, occupation, monthly_income, status, applied_at
    FROM tupad_applications
    UNION ALL
    SELECT id, first_name, middle_name, last_name, program_type, contact_number, occupation, monthly_income, status, applied_at
    FROM spes_applications
    UNION ALL
    SELECT id, first_name, middle_name, last_name, program_type, contact_number, occupation, monthly_income, status, applied_at
    FROM dilp_applications
    ORDER BY applied_at DESC
  `;
  const [rows] = await db.query(query);
  return [rows];
};

// this beneficiary.services handles the fetching of recent applications and approval/rejection logic for the admin dashboard

// Get recent applications (limit 10)
// Get recent applications across ALL programs (limit 10)
exports.getRecentApplications = async (limit = 10) => {
    const query = `
     SELECT id, first_name, middle_name, last_name, program_type, 
       contact_number, occupation, monthly_income, status, applied_at
     FROM tupad_applications 
     WHERE status = 'Pending'
     ORDER BY applied_at DESC 
     LIMIT ?
      `;
  // Note: db.execute returns [rows, fields], so we destructure [rows]
  const [rows] = await db.execute(query, [limit]);
  return [rows];
};

// --- approval & status helpers ---
/*
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
 /*
        UNION ALL

        SELECT  first_name, middle_name, last_name, program_type, 
               contact_number, monthly_income, status, applied_at
        FROM spes_applications
        WHERE status = 'Pending'
// Approve tupad application
*/