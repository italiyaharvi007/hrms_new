const express = require('express')
const router = express.Router()

const authjwt = require('../middleware/authjwt.js');

const settingcontroller =   require('../controller/settingcontroller.js');

// Retrieve all items
router.get('/findallsetting',authjwt, settingcontroller.findallsetting);
// router.get('/findonecountry/:country_id',authjwt, countrycontroller.findonecountry);
router.post('/addsetting',authjwt, settingcontroller.addsetting);
router.post('/updatesetting/:id',authjwt, settingcontroller.updatesetting);
router.post('/deletesetting/:id',authjwt, settingcontroller.deletesetting);


module.exports = router