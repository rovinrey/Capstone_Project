-- This SQL script ensures the applications table has all necessary columns for the approval system
-- Run this on your MySQL database to add the missing columns if they don't exist

-- Add status column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending';

-- Add created_at column if it doesn't exist (for tracking when applications were submitted)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at column for tracking changes
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_status ON applications(status);

-- Create an index on program_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_program_type ON applications(program_type);

-- Optional: Add an approval_date column to track when applications were approved
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP NULL;

-- Add rejection_reason column to store rejection details
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL;

-- Create DILP Applications Table
CREATE TABLE IF NOT EXISTS dilp_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proponent_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  project_type ENUM('Individual', 'Group') NOT NULL,
  category ENUM('Formation', 'Enhancement', 'Restoration') NOT NULL,
  proposed_amount DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255),
  contact_person VARCHAR(255),
  mobile_number VARCHAR(20),
  brief_description LONGTEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approval_date TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_project_type (project_type),
  INDEX idx_created_at (created_at)
);