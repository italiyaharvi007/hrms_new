const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/locationvalidation.js');
const {LocationValidation} = require('../middleware/validationmiddleware');
const authjwt = require('../middleware/authjwt.js');

const countrycontroller =   require('../controller/countrycontroller.js');

// Retrieve all items
router.get('/findallcountry',authjwt, countrycontroller.findallcountry);
router.get('/findonecountry/:country_id',authjwt, countrycontroller.findonecountry);
router.post('/addcountry',authjwt, validator.validateInsertCountry,LocationValidation, countrycontroller.addcountry);
router.post('/updatecountry/:country_id',authjwt, validator.validateUpdateCountry,LocationValidation, countrycontroller.updatecountry);
router.delete('/deletecountry/:country_id',authjwt, countrycontroller.deletecountry);


module.exports = router