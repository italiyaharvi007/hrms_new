const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');
const {validator} = require('../middleware/adminvalidation.js');
const {AdminValidation} = require('../middleware/validationmiddleware.js');

const admincontroller =   require('../controller/admincontroller.js');

// Retrieve all items added

router.get('/findalladmin', admincontroller.findalladmin);
router.get('/findoneadmin/:admin_id', admincontroller.findoneadmin);
router.post('/updateadmin/:admin_id',authjwt,validator.validateAdminUpdate,AdminValidation, admincontroller .updateadmin);
router.delete('/deleteadmin/:admin_id',authjwt, admincontroller.deleteadmin);

module.exports = router