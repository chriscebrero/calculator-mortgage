const express = require('express');
const router = express.Router();
const { calculateMortgagePayment } = require('../controllers/mortgageController');

router.post('/calculateMortgage', calculateMortgagePayment);

module.exports = router;
