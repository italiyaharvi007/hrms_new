const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const departmentcontroller =   require('../controller/departmentcontroller.js');

// Retrieve all items
router.get('/findalldepartment',authjwt, departmentcontroller.findalldepartment);
router.get('/findonedepartment/:dep_id',authjwt, departmentcontroller.findonedepartment);
router.post('/adddepartment',authjwt, validator.validateinsertdepartment,othervalidation, departmentcontroller.adddepartment);
router.post('/updatedepartment/:dep_id',authjwt, validator.validateupdatedepartment, othervalidation, departmentcontroller.updatedepartment);
router.delete('/deletedepartment/:dep_id',authjwt, departmentcontroller.deletedepartment);



module.exports = router