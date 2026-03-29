CREATE TABLE `SPES_Applications` (
  `spes_application_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `application_status` ENUM('Draft', 'Pending', 'Approved') NOT NULL DEFAULT 'Draft',
  `form2_path` VARCHAR(255) DEFAULT NULL,
  `form2a_path` VARCHAR(255) DEFAULT NULL,
  `form4_path` VARCHAR(255) DEFAULT NULL,
  `passport_photo_path` VARCHAR(255) DEFAULT NULL,
  `birth_cert_path` VARCHAR(255) DEFAULT NULL,
  `indigency_path` VARCHAR(255) DEFAULT NULL,
  `registration_path` VARCHAR(255) DEFAULT NULL,
  `grades_path` VARCHAR(255) DEFAULT NULL,
  `philjobnet_screenshot_path` VARCHAR(255) DEFAULT NULL,
  `admin_remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`spes_application_id`),
  KEY `idx_spes_applications_user_id` (`user_id`),
  KEY `idx_spes_applications_status` (`application_status`),
  CONSTRAINT `fk_spes_applications_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
