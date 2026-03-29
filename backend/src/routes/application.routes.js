// this is the routes for the form submissionss
// for all programs

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { validateTupad } = require('../validators/tupad.validators');
const authMiddleware = require('../middlewares/auth.middleware');
// Get all applications from all programs
router.get('/all', applicationController.getAllApplications);
router.get('/export', authMiddleware, applicationController.exportApplications);
router.get('/reports/tupad-monthly', applicationController.getTupadMonthlyReport);

// If you want the full URL to be /api/forms/apply/tupad
// You only put /apply/tupad here:
router.post('/apply/tupad', authMiddleware, validateTupad, applicationController.applyToTupad);
router.put('/approved/application/tupad/:id', authMiddleware, applicationController.approvedTupadApplication);

// SPES route
router.post('/apply/spes', authMiddleware, applicationController.applyToSpes);
router.post('/spes', authMiddleware, applicationController.createSpesDetails);
router.get('/spes/:applicationId', authMiddleware, applicationController.getSpesDetails);
router.put('/spes/:detailId', authMiddleware, applicationController.updateSpesDetails);

// Get recent applications
router.get('/recent', authMiddleware, applicationController.getRecentApplications);
router.get('/status', authMiddleware, applicationController.getApplicationStatus);

// Application approval routes
router.get('/applications/pending', authMiddleware, applicationController.getPendingApplications);
router.get('/applications', authMiddleware, applicationController.getApplicationsByStatus);
router.put('/applications/:id/approve', authMiddleware, applicationController.approveApplication);
router.put('/applications/:id/reject', authMiddleware, applicationController.rejectApplication);


module.exports = router;