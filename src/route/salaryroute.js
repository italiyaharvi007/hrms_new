const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');
const salarycontroller =   require('../controller/salarycontroller.js');

// Retrieve all items
router.get('/findallsalary',authjwt, salarycontroller.findallsalary);
router.get('/findonesalary/:salary_id',authjwt, salarycontroller.findonesalary);
router.post('/addsalary',authjwt, validator.validationinsertsalary, othervalidation, salarycontroller.addsalary);
router.post('/updatesalary/:salary_id',authjwt, validator.validationupdatesalary, othervalidation, salarycontroller.updatesalary);
router.delete('/deletesalary/:salary_id',authjwt, salarycontroller.deletesalary);
router.get('/findbyuser/:user_id', authjwt, salarycontroller.findbyuser);
router.get('/loginusersalary', authjwt, salarycontroller.loginusersalary);
router.get('/countsalary/:user_id', authjwt, salarycontroller.countsalary);


module.exports = router