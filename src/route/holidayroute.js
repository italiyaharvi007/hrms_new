const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/locationvalidation.js');
const {LocationValidation} = require('../middleware/validationmiddleware');
const authjwt = require('../middleware/authjwt.js');

const holidaycontroller =   require('../controller/holidaycontroller.js');

// Retrieve all items
router.get('/findallholiday',authjwt, holidaycontroller.findallholiday);
// router.get('/findonecountry/:country_id',authjwt, countrycontroller.findonecountry);
router.post('/addholiday',authjwt,holidaycontroller.addholiday);
router.post('/updateholiday/:h_id',authjwt, holidaycontroller.updateholiday);
router.post('/deleteholiday/:h_id',authjwt, holidaycontroller.deleteholiday);


module.exports = router