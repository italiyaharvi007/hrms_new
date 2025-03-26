const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const assetcontroller =   require('../controller/assetcontroller.js');

// Retrieve all items
router.get('/findallasset',authjwt, assetcontroller.findallasset);
router.get('/getoneasset/:asset_id',authjwt, assetcontroller.getoneasset);
router.post('/addasset',authjwt, assetcontroller.addasset);
router.post('/updateasset/:asset_id',authjwt, assetcontroller.updateasset);
router.post('/deleteasset/:asset_id',authjwt, assetcontroller.deleteasset);



module.exports = router