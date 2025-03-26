const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/adminvalidation.js');
const {AdminValidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');


const userlogincontroller =   require('../controller/userlogincontroller.js');

// Retrieve all items
router.post('/',userlogincontroller.userlogin);
router.get('/userlogout/:user_id', userlogincontroller.userlogout);
router.post('/userresetpassword', userlogincontroller.userresetpassword);
router.get('/loggedUser',authjwt, userlogincontroller.loggedUser);
router.get('/loggedUsercreatedby', authjwt, userlogincontroller.loggedUsercreatedby);
router.post('/forgotpassword', userlogincontroller.forgotpassword);
router.post('/resetpasswordemail', authjwt, userlogincontroller.resetpasswordemail);
router.post('/simpleresetpassword',userlogincontroller.simpleresetpassword);
module.exports = router
