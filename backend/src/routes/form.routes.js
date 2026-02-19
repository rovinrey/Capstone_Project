const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

// If you want the full URL to be /api/forms/apply/tupad
// You only put /apply/tupad here:
router.post('/apply/tupad', formController.applyToProgram);

// DILP routes
router.post('/apply/dilp', formController.applyToDilp);
router.get('/dilp/recent', formController.getRecentDilpApplications);
router.get('/dilp/:id', formController.getDilpApplicationById);
router.put('/dilp/:id/status', formController.updateDilpStatus);

// Get recent applications
router.get('/recent', formController.getRecentApplications);

// Application approval routes
router.get('/applications/pending', formController.getPendingApplications);
router.get('/applications', formController.getApplicationsByStatus);
router.put('/applications/:id/approve', formController.approveApplication);
router.put('/applications/:id/reject', formController.rejectApplication);

module.exports = router;