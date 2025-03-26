const express = require('express');
const router = express.Router();
const {validator} = require('../middleware/adminvalidation.js');
const {AdminValidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const authcontroller = require('../controller/authcontroller.js');

// Retrieve all items
router.post('/register', validator.validateAdminRegister,AdminValidation, authcontroller.register);
router.post('/login',validator.validateAdminLogin,AdminValidation, authcontroller.login);
router.get('/logout/:admin_id', authcontroller.logout);
router.post('/forget', authcontroller.forgetpass)
router.post('/resetpassword', validator.changepasswordvalidator,AdminValidation,authcontroller.resetpassword) //simple reset password
router.post('/resetpassword/:id/:token', authcontroller.resetpasswordtoken) //reset password using token
router.post('/PasswordResetEmail', authcontroller.PasswordResetEmail)

module.exports = router