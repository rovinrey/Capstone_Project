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

  const details = {
    tupad: null,
    spes: null,
    dilp: null,
    gip: null,
    jobseeker: null
  };

  if (application.program_type === 'tupad') {
    const [tupadRows] = await db.execute(
      'SELECT * FROM tupad_details WHERE application_id = ? LIMIT 1',
      [applicationId]
    );
    details.tupad = tupadRows[0] || null;
  }

  if (application.program_type === 'spes') {
    const [spesRows] = await db.execute(
      'SELECT * FROM spes_details WHERE application_id = ? LIMIT 1',
      [applicationId]
    );
    details.spes = spesRows[0] || null;
  }

  return {
    application,
    details
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
  let whereClause = "WHERE a.status = 'Pending'";
  if (userId) {
    whereClause += ' AND a.user_id = ?';
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

exports.getPendingApplications = async (programType = null) => {
  const params = [];
  let whereClause = "WHERE a.status = 'Pending'";

  if (programType) {
    whereClause += ' AND a.program_type = ?';
    params.push(programType);
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
  `;
  const [rows] = await db.execute(query, params);
  return [rows];
};

exports.getApplicationsByStatus = async (status, programType = null) => {
  const params = [status];
  let whereClause = 'WHERE a.status = ?';

  if (programType) {
    whereClause += ' AND a.program_type = ?';
    params.push(programType);
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
      a.rejection_reason,
      a.applied_at
    FROM applications a
    LEFT JOIN beneficiaries b ON b.user_id = a.user_id
    LEFT JOIN spes_details sd ON sd.application_id = a.application_id
    LEFT JOIN users u ON a.user_id = u.user_id
    ${whereClause}
    ORDER BY a.applied_at DESC
  `;
  const [rows] = await db.execute(query, params);
  return [rows];
};

exports.approveApplication = async (id) => {
  const query = `
    UPDATE applications
    SET status = 'Approved',
        approval_date = NOW(),
        rejection_reason = NULL
    WHERE application_id = ?
  `;
  return await db.execute(query, [id]);
};

exports.rejectApplication = async (id, reason) => {
  const query = `
    UPDATE applications
    SET status = 'Rejected',
        rejection_reason = ?,
        approval_date = NULL
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

exports.getApplicationsForExport = async (programType = null, status = null) => {
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('a.status = ?');
    params.push(status);
  }

  if (programType) {
    conditions.push('a.program_type = ?');
    params.push(programType);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

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

exports.getTupadMonthlyReport = async (monthInput) => {
  const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  const selectedMonth = monthRegex.test(String(monthInput || ''))
    ? String(monthInput)
    : new Date().toISOString().slice(0, 7);

  const startDate = `${selectedMonth}-01`;
  const [year, month] = selectedMonth.split('-').map(Number);
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);
  const endDateExpr = 'LAST_DAY(?)';
  const DAILY_WAGE = 435;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      attendance_id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      program_type VARCHAR(30) NULL,
      attendance_date DATE NOT NULL,
      time_in DATETIME NULL,
      time_out DATETIME NULL,
      status ENUM('Present', 'Incomplete') DEFAULT 'Incomplete',
      remarks VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user_day (user_id, attendance_date),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  const [applicantGenderRows] = await db.execute(
    `
      SELECT
        SUM(
          CASE
            WHEN LOWER(COALESCE(b.gender, '')) = 'male' THEN 1
            ELSE 0
          END
        ) AS male,
        SUM(
          CASE
            WHEN LOWER(COALESCE(b.gender, '')) = 'female' THEN 1
            ELSE 0
          END
        ) AS female,
        COUNT(*) AS total
      FROM applications a
      LEFT JOIN beneficiaries b ON b.user_id = a.user_id
      WHERE LOWER(a.program_type) = 'tupad'
        AND a.applied_at >= ?
        AND a.applied_at < DATE_ADD(LAST_DAY(?), INTERVAL 1 DAY)
    `,
    [startDate, startDate]
  );

  const [placementsRows] = await db.execute(
    `
      SELECT COUNT(*) AS placements_assisted
      FROM applications a
      WHERE LOWER(a.program_type) = 'tupad'
        AND a.status = 'Approved'
        AND COALESCE(a.approval_date, a.updated_at, a.applied_at) <= ${endDateExpr}
    `,
    [startDate]
  );

  const [beneficiaryProfileRows] = await db.execute(
    `
      SELECT
        a.application_id,
        a.user_id,
        CONCAT_WS(' ', b.first_name, b.middle_name, b.last_name) AS full_name,
        COALESCE(b.address, sd.present_address, '') AS address,
        b.birth_date,
        b.gender
      FROM applications a
      LEFT JOIN beneficiaries b ON b.user_id = a.user_id
      LEFT JOIN spes_details sd ON sd.application_id = a.application_id
      WHERE LOWER(a.program_type) = 'tupad'
        AND a.status = 'Approved'
        AND COALESCE(a.approval_date, a.updated_at, a.applied_at) <= ${endDateExpr}
      ORDER BY full_name ASC
    `,
    [startDate]
  );

  const [payrollRows] = await db.execute(
    `
      SELECT
        ar.user_id,
        COALESCE(
          NULLIF(TRIM(CONCAT_WS(' ', b.first_name, b.middle_name, b.last_name)), ''),
          u.user_name
        ) AS full_name,
        COUNT(*) AS days_worked,
        ? AS daily_wage,
        COUNT(*) * ? AS total_payout
      FROM attendance_records ar
      LEFT JOIN users u ON u.user_id = ar.user_id
      LEFT JOIN beneficiaries b ON b.user_id = ar.user_id
      WHERE ar.status = 'Present'
        AND ar.attendance_date >= ?
        AND ar.attendance_date <= LAST_DAY(?)
        AND EXISTS (
          SELECT 1
          FROM applications a
          WHERE a.user_id = ar.user_id
            AND LOWER(a.program_type) = 'tupad'
            AND a.status = 'Approved'
            AND COALESCE(a.approval_date, a.updated_at, a.applied_at) <= LAST_DAY(?)
        )
      GROUP BY ar.user_id, full_name
      ORDER BY full_name ASC
    `,
    [DAILY_WAGE, DAILY_WAGE, startDate, startDate, startDate]
  );

  const payrollTotals = payrollRows.reduce(
    (acc, row) => {
      acc.days_worked += Number(row.days_worked || 0);
      acc.total_payout += Number(row.total_payout || 0);
      return acc;
    },
    { days_worked: 0, total_payout: 0 }
  );

  const gender = applicantGenderRows[0] || {};
  const male = Number(gender.male || 0);
  const female = Number(gender.female || 0);
  const totalApplicants = Number(gender.total || male + female);

  return {
    period: {
      month: selectedMonth,
      startDate,
      endDate
    },
    sprs: {
      applicantsRegistered: {
        male,
        female,
        total: totalApplicants
      },
      placementsAssisted: Number(placementsRows[0]?.placements_assisted || 0)
    },
    beneficiaryProfile: beneficiaryProfileRows,
    attendancePayrollSummary: payrollRows,
    totals: payrollTotals,
    dailyWage: DAILY_WAGE
  };
};

// =============================================
// Admin CRUD operations for beneficiary management
// =============================================

/**
 * Admin adds a beneficiary directly (no user account required).
 * Inserts into beneficiaries table and creates an Approved application record.
 */
exports.adminAddBeneficiary = async (data) => {
  const {
    first_name, middle_name, last_name, extension_name,
    birth_date, gender, civil_status, contact_number, address,
    program_type
  } = data;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert beneficiary record
    const [beneficiaryResult] = await connection.execute(
      `INSERT INTO beneficiaries
        (user_id, first_name, middle_name, last_name, extension_name,
         birth_date, gender, civil_status, contact_number, address, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        data.user_id || null,
        first_name,
        middle_name || null,
        last_name,
        extension_name || null,
        birth_date,
        gender,
        civil_status,
        contact_number || null,
        address
      ]
    );

    const beneficiaryId = beneficiaryResult.insertId;

    // Create an approved application record so the beneficiary shows up in the system
    let applicationId = null;
    if (program_type) {
      const [appResult] = await connection.execute(
        `INSERT INTO applications
          (user_id, status, program_type, approval_date)
         VALUES (?, 'Approved', ?, NOW())`,
        [data.user_id || null, program_type]
      );
      applicationId = appResult.insertId;
    }

    await connection.commit();
    return { beneficiaryId, applicationId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * Admin updates beneficiary data.
 */
exports.adminUpdateBeneficiary = async (beneficiaryId, data) => {
  const {
    first_name, middle_name, last_name, extension_name,
    birth_date, gender, civil_status, contact_number, address
  } = data;

  const [result] = await db.execute(
    `UPDATE beneficiaries
     SET first_name = ?, middle_name = ?, last_name = ?, extension_name = ?,
         birth_date = ?, gender = ?, civil_status = ?, contact_number = ?, address = ?
     WHERE beneficiary_id = ?`,
    [
      first_name,
      middle_name || null,
      last_name,
      extension_name || null,
      birth_date,
      gender,
      civil_status,
      contact_number || null,
      address,
      beneficiaryId
    ]
  );

  return result;
};

/**
 * Admin updates the program assignment for a beneficiary.
 * Updates the existing application's program_type.
 */
exports.adminUpdateBeneficiaryProgram = async (applicationId, programType) => {
  const [result] = await db.execute(
    `UPDATE applications SET program_type = ? WHERE application_id = ?`,
    [programType, applicationId]
  );
  return result;
};

/**
 * Admin deletes a beneficiary and their associated application records.
 */
exports.adminDeleteBeneficiary = async (beneficiaryId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Get user_id for this beneficiary to clean up applications
    const [rows] = await connection.execute(
      `SELECT user_id FROM beneficiaries WHERE beneficiary_id = ?`,
      [beneficiaryId]
    );

    if (rows.length === 0) {
      throw new Error('Beneficiary not found');
    }

    // Delete attendance records for this beneficiary
    await connection.execute(
      `DELETE FROM attendance WHERE beneficiary_id = ?`,
      [beneficiaryId]
    );

    // Delete the beneficiary record
    await connection.execute(
      `DELETE FROM beneficiaries WHERE beneficiary_id = ?`,
      [beneficiaryId]
    );

    await connection.commit();
    return { deleted: true };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * Get a single beneficiary by ID (for edit form).
 */
exports.getBeneficiaryById = async (beneficiaryId) => {
  const query = `
    SELECT
      b.beneficiary_id,
      b.user_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      b.extension_name,
      b.birth_date,
      b.gender,
      b.civil_status,
      b.contact_number,
      b.address,
      b.is_active,
      a.application_id,
      a.program_type,
      a.status AS application_status,
      a.approval_date
    FROM beneficiaries b
    LEFT JOIN applications a ON a.user_id = b.user_id AND a.status = 'Approved'
    WHERE b.beneficiary_id = ?
    LIMIT 1
  `;
  const [rows] = await db.execute(query, [beneficiaryId]);
  return rows[0] || null;
};

/**
 * Get all beneficiaries with full details for admin management.
 */
exports.getAllBeneficiariesForAdmin = async () => {
  const query = `
    SELECT
      b.beneficiary_id,
      b.user_id,
      b.first_name,
      b.middle_name,
      b.last_name,
      b.extension_name,
      b.birth_date,
      b.gender,
      b.civil_status,
      b.contact_number,
      b.address,
      b.is_active,
      a.application_id,
      a.program_type,
      a.status AS application_status,
      a.approval_date,
      a.applied_at
    FROM beneficiaries b
    LEFT JOIN applications a ON a.user_id = b.user_id AND a.status = 'Approved'
    LEFT JOIN users u ON u.user_id = b.user_id
    ORDER BY b.beneficiary_id DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
};