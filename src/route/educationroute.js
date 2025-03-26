const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const educationcontroller =   require('../controller/educationcontroller.js');

// Retrieve all items
router.get('/geteducation',authjwt, educationcontroller.geteducation);
router.get('/getoneeducation/:education_id',authjwt, educationcontroller.getoneeducation);
router.post('/addeducation',authjwt, educationcontroller.addeducation);
router.post('/updateeducation/:education_id',authjwt, educationcontroller.updateeducation);
router.post('/deleteeducation/:education_id',authjwt, educationcontroller.deleteeducation);



module.exports = router