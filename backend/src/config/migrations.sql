-- user table
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','beneficiary') DEFAULT 'beneficiary',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- application table
CREATE TABLE `applications` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'link to user table ',
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `rejection_reason` text DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `program_type` enum('tupad','spes','gip','dilp','job_seekers') NOT NULL,
  `approval_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`application_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- beneficiary table

CREATE TABLE `beneficiaries` (
  `beneficiary_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `extension_name` varchar(10) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `civil_status` enum('Single','Married','Widowed','Separated') NOT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `address` text NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`beneficiary_id`),
  UNIQUE KEY `unique_beneficiary` (`first_name`,`last_name`,`birth_date`),
  KEY `fk_user_beneficiary` (`user_id`),
  CONSTRAINT `fk_user_beneficiary` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- tupad details table
CREATE TABLE `tupad_details` (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `valid_id_type` varchar(50) DEFAULT NULL,
  `id_number` varchar(100) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `monthly_income` decimal(10,2) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widowed','Separated') DEFAULT NULL,
  `work_category` varchar(100) DEFAULT NULL,
  `job_preference` varchar(100) DEFAULT NULL,
  `educational_attainment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `tupad_details_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- spes details table
CREATE TABLE `spes_details` (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `place_of_birth` varchar(150) DEFAULT NULL,
  `citizenship` varchar(50) DEFAULT 'Filipino',
  `social_media_account` varchar(100) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widow/er','Separated') NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `type_of_student` enum('Student','ALS student','out-of-school (OSY)') NOT NULL,
  `parent_status` enum('Living together','Solo Parent','Separated') NOT NULL,
  `father_name` varchar(150) DEFAULT NULL,
  `father_occupation` varchar(100) DEFAULT NULL,
  `father_contact` varchar(20) DEFAULT NULL,
  `mother_maiden_name` varchar(150) DEFAULT NULL,
  `mother_occupation` varchar(100) DEFAULT NULL,
  `mother_contact` varchar(20) DEFAULT NULL,
  `education_level` enum('Elementary','Secondary','Tertiary','Tech-Voc') NOT NULL,
  `name_of_school` varchar(200) DEFAULT NULL,
  `degree_earned_course` varchar(200) DEFAULT NULL,
  `year_level` varchar(50) DEFAULT NULL,
  `present_address` text NOT NULL,
  `permanent_address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`detail_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `spes_details_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

--dilp details table

CREATE TABLE `dilp_applications` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `proponent_name` varchar(255) NOT NULL,
  `sex` varchar(20) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `project_title` varchar(255) NOT NULL,
  `project_type` enum('Individual','Group') DEFAULT 'Individual',
  `category` enum('Formation','Enhancement','Restoration') DEFAULT 'Formation',
  `proposed_amount` decimal(15,2) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `business_experience` text DEFAULT NULL,
  `estimated_monthly_income` decimal(15,2) DEFAULT 0.00,
  `number_of_beneficiaries` int(11) DEFAULT 0,
  `skills_training` text DEFAULT NULL,
  `valid_id_number` varchar(100) DEFAULT NULL,
  `brief_description` text DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `idx_proponent` (`proponent_name`),
  KEY `idx_project` (`project_title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

--programs table
CREATE TABLE `programs` (
  `program_id` int(11) NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL, 
  `slots` int(11) NOT NULL,
  `budget` decimal(15,2) NOT NULL,
  `status` enum('active','inactive','pending','completed') DEFAULT 'pending',
  `filled` int(11) DEFAULT 0,
  `used` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`program_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

--attendance table
CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL AUTO_INCREMENT,
  `beneficiary_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL,
  `status` enum('Present','Absent','Late','Excused') DEFAULT 'Present',
  `remarks` text DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`attendance_id`),
  KEY `beneficiary_id` (`beneficiary_id`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`beneficiary_id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
