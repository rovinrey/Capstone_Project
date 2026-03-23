const db = require("../config/db");

exports.getAllBeneficiaries = async () => {
  const query = `
    SELECT
      a.application_id AS id,
      a.application_id,
      a.user_id,
      b.beneficiary_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      CONCAT_WS(' ', b.first_name, b.middle_name, b.last_name) AS full_name,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.program_type,
      'Approved' AS status,
      a.approval_date,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN users u ON u.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    WHERE a.status = 'Approved'
    ORDER BY COALESCE(a.approval_date, a.updated_at, a.applied_at) DESC
  `;

  const [rows] = await db.execute(query);
  return [rows];
};

exports.getApprovedCount = async () => {
  const query = `
    SELECT COUNT(*) AS count
    FROM applications
    WHERE status = 'Approved'
  `;

  const [rows] = await db.execute(query);
  return Number(rows[0]?.count || 0);
};

exports.getBeneficiaryApplicationDetails = async (applicationId) => {
  const baseQuery = `
    SELECT
      a.application_id,
      a.user_id,
      a.program_type,
      a.status,
      a.rejection_reason,
      a.applied_at,
      a.approval_date,
      a.updated_at,
      u.email,
      u.phone,
      b.beneficiary_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      b.birth_date,
      b.gender,
      b.contact_number,
      b.address
    FROM applications a
    LEFT JOIN users u ON u.user_id = a.user_id
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    WHERE a.application_id = ?
    LIMIT 1
  `;

  const [baseRows] = await db.execute(baseQuery, [applicationId]);
  if (!baseRows.length) {
    return null;
  }

  const application = baseRows[0];

  const [tupadRows] = await db.execute(
    'SELECT * FROM tupad_details WHERE application_id = ? LIMIT 1',
    [applicationId]
  );
  const [spesRows] = await db.execute(
    'SELECT * FROM spes_details WHERE application_id = ? LIMIT 1',
    [applicationId]
  );
  const [dilpRows] = await db.execute(
    'SELECT * FROM dilp_details WHERE application_id = ? LIMIT 1',
    [applicationId]
  );
  const [gipRows] = await db.execute(
    'SELECT * FROM gip_details WHERE application_id = ? LIMIT 1',
    [applicationId]
  );
  const [jobseekerRows] = await db.execute(
    'SELECT * FROM jobseeker_details WHERE application_id = ? LIMIT 1',
    [applicationId]
  );

  return {
    application,
    details: {
      tupad: tupadRows[0] || null,
      spes: spesRows[0] || null,
      dilp: dilpRows[0] || null,
      gip: gipRows[0] || null,
      jobseeker: jobseekerRows[0] || null
    }
  };
};

// Get all applications across programs (for admin dashboard)
exports.getAllApplications = async () => {
  const query = `
    SELECT
      a.application_id AS id,
      a.application_id,
      a.user_id,
      a.program_type,
      b.first_name,
      b.middle_name,
      b.last_name,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.status,
      a.rejection_reason,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    ORDER BY a.applied_at DESC
    LIMIT 200
  `;
  const [rows] = await db.execute(query);
  return [rows];
};

exports.getRecentApplications = async (limit = 10, userId = null) => {
  const params = [];
  let whereClause = '';
  if (userId) {
    whereClause = 'WHERE a.user_id = ?';
    params.push(userId);
  }

  const query = `
    SELECT
      a.application_id AS id,
      a.application_id,
      a.user_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      a.program_type,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.status,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    ${whereClause}
    ORDER BY a.applied_at DESC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await db.execute(query, params);
  return [rows];
};

exports.getPendingApplications = async () => {
  const query = `
    SELECT
      a.application_id AS id,
      a.application_id,
      a.user_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      a.program_type,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.status,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    WHERE a.status = 'Pending'
    ORDER BY a.applied_at DESC
  `;
  const [rows] = await db.execute(query);
  return [rows];
};

exports.getApplicationsByStatus = async (status) => {
  const query = `
    SELECT
      a.application_id AS id,
      a.application_id,
      a.user_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      a.program_type,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.status,
      a.rejection_reason,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    WHERE a.status = ?
    ORDER BY a.applied_at DESC
  `;
  const [rows] = await db.execute(query, [status]);
  return [rows];
};

exports.approveApplication = async (id) => {
  const query = `
    UPDATE applications
    SET status = 'Approved'
    WHERE application_id = ?
  `;
  return await db.execute(query, [id]);
};

exports.rejectApplication = async (id, reason) => {
  const query = `
    UPDATE applications
    SET status = 'Rejected', rejection_reason = ?
    WHERE application_id = ?
  `;
  return await db.execute(query, [reason || null, id]);
};

exports.getUserApplicationStatus = async (userId) => {
  const query = `
    SELECT
      application_id,
      program_type,
      status,
      rejection_reason,
      applied_at,
      updated_at
    FROM applications
    WHERE user_id = ?
    ORDER BY applied_at DESC
  `;

  const [rows] = await db.execute(query, [userId]);

  const supportedPrograms = ['TUPAD', 'SPES', 'DILP', 'GIP', 'Jobseeker'];
  const summary = supportedPrograms.reduce((acc, program) => {
    acc[program] = null;
    return acc;
  }, {});

  // Keep latest status per program based on descending applied_at.
  for (const row of rows) {
    if (summary[row.program_type] === null) {
      summary[row.program_type] = row.status;
    }
  }

  return {
    summary,
    submissions: rows
  };
};

exports.getApplicationsForExport = async (programType = null) => {
  const params = [];
  let whereClause = '';

  if (programType) {
    whereClause = 'WHERE a.program_type = ?';
    params.push(programType);
  }

  const query = `
    SELECT
      a.application_id AS id,
      a.user_id,
      a.program_type,
      b.first_name,
      b.middle_name,
      b.last_name,
      COALESCE(b.contact_number, u.phone) AS contact_number,
      COALESCE(b.address, sd.present_address, NULL) AS address,
      a.status,
      a.rejection_reason,
      a.applied_at,
      a.approval_date
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    ${whereClause}
    ORDER BY a.applied_at DESC
  `;

  const [rows] = await db.execute(query, params);
  return rows;
};