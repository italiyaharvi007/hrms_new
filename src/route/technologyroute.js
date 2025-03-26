const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const technologycontroller =   require('../controller/technologycontroller.js');

// Retrieve all items
router.get('/findalltechnology',authjwt, technologycontroller.findalltechnology);
router.get('/findonetechnology/:tec_id',authjwt, technologycontroller.findonetechnology);
router.post('/addtechnology',authjwt, validator.validationinserttechnology,othervalidation, technologycontroller.addtechnology);
router.post('/updatetechnology/:tec_id',authjwt, validator.validationupdatetechnology, othervalidation, technologycontroller.updatetechnology);
router.delete('/deletetechnology/:tec_id',authjwt, technologycontroller.deletetechnology);
router.get('/findbydep/:dep_id', authjwt, technologycontroller.findbydep);

module.exports = router