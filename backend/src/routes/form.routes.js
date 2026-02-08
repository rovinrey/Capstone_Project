const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

// If you want the full URL to be /api/forms/apply/tupad
// You only put /apply/tupad here:
router.post('/apply/tupad', formController.applyToProgram);

module.exports = router;