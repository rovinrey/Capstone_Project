const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiary.controller');

router.get('/', beneficiaryController.getAllBeneficiaries);

// return total number of beneficiaries for dashboard stats
router.get('/count', beneficiaryController.getCount);
router.get('/:applicationId/details', beneficiaryController.getBeneficiaryApplicationDetails);

module.exports = router;