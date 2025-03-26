const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const projectcontroller = require('../controller/projectcontroller.js');

// Retrieve all items
router.get('/findallproject',authjwt, projectcontroller.findallproject);
router.get('/findoneproject/:pro_id',authjwt, projectcontroller.findoneproject);
router.post('/addproject',authjwt, validator.validateinsertproject, othervalidation, projectcontroller.addproject);
router.post('/updateproject/:pro_id',authjwt, validator.validateupdateproject,othervalidation, projectcontroller.updateproject);
router.delete('/deleteproject/:pro_id',authjwt, projectcontroller.deleteproject);
router.get('/findbyuser/:user_id', authjwt , projectcontroller.findbyuser);
router.get('/findbytechnology/:tec_id', authjwt , projectcontroller.findbytechnology);
router.get('/loginuserproject', authjwt, projectcontroller.loginuserproject);

module.exports = router