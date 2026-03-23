// services/tupadService.js
const db = require('../config/db');
const tupadModel = require('../models/tupad.models');

exports.applyTupad = async (data) => {
    const userId = data.user_id || data.userId;
    if (!userId) {
        throw new Error('User ID is required for TUPAD application');
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Prevent duplicate application
        const exists = await tupadModel.checkDuplicateApplication(userId);
        if (exists) {
            throw new Error('You already applied for TUPAD');
        }

        // Create central application
        const applicationId = await tupadModel.createApplication(connection, userId);

        // Save program-specific details
        await tupadModel.createTupadDetails(connection, {
            application_id: applicationId,
            valid_id_type: data.valid_id_type,
            id_number: data.id_number,
            occupation: data.occupation,
            monthly_income: data.monthly_income,
            civil_status: data.civil_status,
            work_category: data.occupation,
            job_preference: data.job_preference,
            educational_attainment: data.Educational_attainment || data.educational_attainment
        });

        // Save beneficiary profile
        await tupadModel.createBeneficiary(connection, {
            user_id: userId,
            first_name: data.first_name,
            middle_name: data.middle_name || '',
            last_name: data.last_name,
            birth_date: data.date_of_birth,
            gender: data.gender,
            contact_number: data.contact_number
        });

        await connection.commit();

        return { application_id: applicationId };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.approveTupadApplication = async (applicationId) => {
    const [result] = await db.query(
        `UPDATE applications SET status = 'Approved', approval_date = NOW() WHERE application_id = ?`,
        [applicationId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Application not found');
    }
    return result;
};