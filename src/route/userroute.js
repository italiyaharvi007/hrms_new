const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');
const uploadMiddleware = require('../middleware/uploadmiddleware.js');

const usercontroller =   require('../controller/usercontroller.js');
//const { showAddUserForm, addUser } = require('../controllers/userController');


// Retrieve all items
router.get('/findalluser',authjwt, usercontroller.findalluser);
router.get('/findoneuser/:user_id',authjwt, usercontroller.findoneuser);
router.post('/adduser',authjwt, uploadMiddleware.single('image'), validator.validationinsertuser, othervalidation, usercontroller.adduser);
router.post('/updateuser/:user_id',authjwt,uploadMiddleware.single('image'),validator.validationupdateuser, othervalidation, usercontroller.updateuser);
router.delete('/deleteuser/:user_id',authjwt, usercontroller.deleteuser);
router.get('/findbycity/:city_id', authjwt, usercontroller.findbycity);
router.get('/findbyrole/:role_id', authjwt, usercontroller.findbyrole);

router.get('/findassignmanager', authjwt, usercontroller.findassignmanager)

module.exports = router
