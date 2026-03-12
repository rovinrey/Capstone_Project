// this is the routes for the form submissionss
// for all programs

const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');
// Get all applications from all programs
router.get('/all', formController.getAllApplications);

// If you want the full URL to be /api/forms/apply/tupad
// You only put /apply/tupad here:
router.post('/apply/tupad', formController.applyToTupad);
router.put('/approved/application/tupad/:id', formController.approvedTupadApplication);

// SPES route
router.post('/apply/spes', formController.applyToSpes);

// Get recent applications
router.get('/recent', formController.getRecentApplications);

// Application approval routes
router.get('/applications/pending', formController.getPendingApplications);


module.exports = router;