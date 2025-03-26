const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/locationvalidation.js');
const {LocationValidation} = require('../middleware/validationmiddleware');
const authjwt = require('../middleware/authjwt.js');

const citycontroller =   require('../controller/citycontroller.js');

// Retrieve all items
router.get('/findallcity',authjwt, citycontroller.findallcity);
router.get('/findonecity/:city_id',authjwt, citycontroller.findonecity);
router.post('/addcity',authjwt, validator.validateInsertCity,LocationValidation, citycontroller.addcity);
router.post('/updatecity/:city_id',authjwt, validator.validateUpdateCity, LocationValidation, citycontroller.updatecity);
router.delete('/deletecity/:city_id',authjwt, citycontroller.deletecity);
router.get('/findbystateid/:state_id', authjwt , citycontroller.findbystateid);
router.get('/cityexportpdf', authjwt, citycontroller.cityexportpdf);
module.exports = router