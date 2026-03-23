-- 1. AUTHENTICATION & CORE USER ACCOUNTS
CREATE TABLE IF NOT EXISTS users (
    user_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(200) UNIQUE NULL,
    phone VARCHAR(15) UNIQUE NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'beneficiary') DEFAULT 'beneficiary',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. MASTER BENEFICIARY PROFILES (Permanent Records)
-- Once approved, their data lives here permanently.
CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    extension_name VARCHAR(10), -- Jr., III, etc.
    birth_date DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    contact_number VARCHAR(15),
    address TEXT,
    is_active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 3. PROGRAM MASTER (Admin creates projects here)
-- Example: TUPAD Street Cleaning, SPES Batch 1
CREATE TABLE IF NOT EXISTS programs (
    program_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    program_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    slots INT(11) NOT NULL,
    filled INT(11) DEFAULT 0,
    budget DECIMAL(15, 2) NOT NULL,
    used DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. CENTRALIZED APPLICATIONS (Traffic Control)    
CREATE TABLE IF NOT EXISTS applications (
    application_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    program_type ENUM('TUPAD', 'SPES', 'DILP', 'GIP', 'Jobseeker') NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approval_date TIMESTAMP NULL,
    rejection_reason TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
);

-- 5. THE 5 PROGRAM DETAIL TABLES (Extensions)
-- These link to the main application_id to store unique form fields.

CREATE TABLE IF NOT EXISTS tupad_details (
    detail_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    application_id INT(11) NOT NULL,
    valid_id_type VARCHAR(50),
    id_number VARCHAR(100),
    occupation VARCHAR(100),
    monthly_income DECIMAL(10, 2),  
    civil_status ENUM('Single', 'Married', 'Widowed', 'Separated'),
    work_category VARCHAR(100),
    job_preference VARCHAR(100),
    educational_attainment VARCHAR(100),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

-- spes_details is the most complex due to the depth of information required for SPES applications.
CREATE TABLE IF NOT EXISTS spes_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    
    -- Identity & Social
    place_of_birth VARCHAR(150),
    citizenship VARCHAR(50) DEFAULT 'Filipino',
    
    -- Status & Categories (Critical for SPES eligibility)
    type_of_student ENUM('Student', 'ALS student', 'out-of-school (OSY)') NOT NULL,
    
    -- Parental Info (Normalized)
    parent_status ENUM('Living together', 'Solo Parent', 'Separated') NOT NULL,
    
    father_name VARCHAR(150),
    father_occupation VARCHAR(100),
    father_contact VARCHAR(20),
    mother_maiden_name VARCHAR(150),
    mother_occupation VARCHAR(100),
    mother_contact VARCHAR(20),
    
    -- Education Details
    education_level ENUM('Elementary', 'Secondary', 'Tertiary', 'Tech-Voc') NOT NULL,
    name_of_school VARCHAR(200),
    degree_earned_course VARCHAR(200),
    year_level_grade VARCHAR(50), -- e.g., "Grade 10" or "3rd Year"
    date_of_attendance VARCHAR(100),
    

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS dilp_details (
    detail_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    application_id INT(11) NOT NULL,
    business_type VARCHAR(100),
    project_proposal TEXT,
    estimated_cost DECIMAL(15, 2),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gip_details (
    detail_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    application_id INT(11) NOT NULL,
    degree_earned VARCHAR(255),
    specialization VARCHAR(100),
    preferred_assignment VARCHAR(100),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobseeker_details (
    detail_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    application_id INT(11) NOT NULL,
    skills_tags TEXT,
    years_experience INT(2),
    highest_education VARCHAR(100),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

-- 6. OPERATIONS (ROSTER, ATTENDANCE & PAYROLL)

CREATE TABLE IF NOT EXISTS program_participants (
    participant_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    program_id INT(11) NOT NULL,
    beneficiary_id INT(11) NOT NULL,
    status ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (program_id, beneficiary_id)
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    attendance_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    beneficiary_id INT(11) NOT NULL,
    program_id INT(11) NOT NULL,
    log_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late'),
    remarks TEXT,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE
);

-- 8. ATTENDANCE TRACKING (Approved beneficiaries only)
CREATE TABLE IF NOT EXISTS attendance_records (
    attendance_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    program_type VARCHAR(30),
    attendance_date DATE NOT NULL,
    time_in DATETIME NULL,
    time_out DATETIME NULL,
    status ENUM('Present', 'Incomplete') DEFAULT 'Incomplete',
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_user_day (user_id, attendance_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payroll_records (
    payroll_id INT(11) PRIMARY KEY AUTO_INCREMENT,
    beneficiary_id INT(11) NOT NULL,
    program_id INT(11) NOT NULL,
    total_days_present INT(11),
    amount_due DECIMAL(15, 2),
    payout_status ENUM('Unpaid', 'Processing', 'Paid') DEFAULT 'Unpaid',
    payout_date DATE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE
);