const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/locationvalidation.js');
const {LocationValidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const statecontroller =   require('../controller/statecontroller.js');

// Retrieve all items
router.get('/findallstate',authjwt, statecontroller.findallstate);
router.get('/findonestate/:state_id',authjwt, statecontroller.findonestate);
router.post('/addstate',authjwt, validator.validateinsertstate,LocationValidation, statecontroller.addstate);
router.post('/updatestate/:state_id',authjwt, validator.validateupdatestate,LocationValidation, statecontroller.updatestate);
router.delete('/deletestate/:state_id',authjwt, statecontroller.deletestate);
router.get('/findbycountry/:country_id', authjwt, statecontroller.findbycountry)

module.exports = router