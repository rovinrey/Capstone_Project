// this is the routes for the form submissionss
// for all programs

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
// Get all applications from all programs
router.get('/all', applicationController.getAllApplications);
router.get('/export', applicationController.exportApplications);

// If you want the full URL to be /api/forms/apply/tupad
// You only put /apply/tupad here:
router.post('/apply/tupad', applicationController.applyToTupad);
router.put('/approved/application/tupad/:id', applicationController.approvedTupadApplication);

// SPES route
router.post('/apply/spes', applicationController.applyToSpes);
router.post('/spes', applicationController.createSpesDetails);
router.get('/spes/:applicationId', applicationController.getSpesDetails);
router.put('/spes/:detailId', applicationController.updateSpesDetails);

// Get recent applications
router.get('/recent', applicationController.getRecentApplications);
router.get('/status', applicationController.getApplicationStatus);

// Application approval routes
router.get('/applications/pending', applicationController.getPendingApplications);
router.get('/applications', applicationController.getApplicationsByStatus);
router.put('/applications/:id/approve', applicationController.approveApplication);
router.put('/applications/:id/reject', applicationController.rejectApplication);


module.exports = router;