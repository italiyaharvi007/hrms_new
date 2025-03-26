const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const rolecontroller =  require('../controller/rolecontroller.js');

// Retrieve all items
router.get('/findallrole',authjwt, rolecontroller.findallrole);
router.get('/findonerole/:role_id',authjwt, rolecontroller.findonerole);
router.post('/addrole',authjwt, validator.validateinsertrole, othervalidation, rolecontroller.addrole);
router.post('/updaterole/:role_id',authjwt, validator.validationupdaterole, othervalidation, rolecontroller.updaterole);
router.delete('/deleterole/:role_id',authjwt, rolecontroller.deleterole);


module.exports = router