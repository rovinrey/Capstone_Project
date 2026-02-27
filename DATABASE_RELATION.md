# CAPSTONE PROJECT
## TUPAD and Pangkabuhayan Management System
### Database Workflow Documentation

---

## 1. System Overview

This document explains the proper database workflow for handling online beneficiary applications in the system.

The system ensures that applicants are not immediately treated as official beneficiaries until their application has been reviewed and approved by an administrator.

---

## 2. Database Structure Overview

The system follows a **3-step process**:

1. User Account Creation  
2. Application Submission  
3. Beneficiary Approval  

---

## 3. Database Tables

### 3.1 users (Login Accounts)

This table stores login credentials for beneficiaries.

| Field | Description |
|-------|------------|
| user_id (PK) | Unique user ID |
| email | User login email |
| password | Encrypted password |
| role | beneficiary |
| created_at | Account creation date |

---

### 3.2 applications (Submitted Forms)

When a beneficiary submits a form (e.g., TUPAD application), the data is stored here first.

| Field | Description |
|-------|------------|
| application_id (PK) | Unique application ID |
| user_id (FK) | Linked to users table |
| program_id (FK) | Selected program |
| first_name | Applicant first name |
| last_name | Applicant last name |
| birth_date | Date of birth |
| gender | Gender |
| address | Home address |
| contact_number | Contact number |
| status | pending / approved / rejected |
| submitted_at | Submission date |

At this stage, the applicant is NOT yet an official beneficiary.

---

### 3.3 beneficiaries (Approved Applicants)

This table stores only approved applicants.

When an admin approves an application:

1. Data is inserted into the beneficiaries table.
2. Application status is updated to "approved".
3. Program participant count increases.

| Field | Description |
|-------|------------|
| beneficiary_id (PK) | Unique beneficiary ID |
| application_id (FK) | Linked to applications |
| first_name | First name |
| last_name | Last name |
| birth_date | Date of birth |
| gender | Gender |
| address | Address |
| contact_number | Contact number |
| approved_at | Approval date |

---

## 4. System Workflow

### Step 1: Register Account
Stored in: users table

### Step 2: Submit Application (e.g., TUPAD)
Stored in: applications table  
Status = pending

### Step 3: Admin Review
If approved:
- Insert data into beneficiaries table
- Update application status to approved
- Increase program total beneficiaries by +1

---

## 5. Important Design Principle

User Account ≠ Applicant ≠ Beneficiary

A user becomes a beneficiary only after approval.

---

## 6. Advantages of This Design

- Separates applicants from official beneficiaries
- Keeps rejected applications for record
- Prevents invalid data in beneficiary records
- Follows proper government workflow structure
- Scalable for future programs

---

## End of Documentation