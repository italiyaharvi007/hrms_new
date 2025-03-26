const express = require('express')
const router = express.Router()

const authjwt = require('../middleware/authjwt.js');

const assetassigncontroller = require('../controller/assetassigncontroller.js');

// Retrieve all items
router.get('/getassetassign',authjwt, assetassigncontroller.getassetassign);
router.get('/getoneassetassign/:asset_assign_id',authjwt, assetassigncontroller.getoneassetassign);
router.post('/addassetassign', authjwt, assetassigncontroller.addassetassign);
router.post('/updateassetassign/:asset_assign_id', authjwt, assetassigncontroller.updateassetassign);
router.post('/deleteassetassign/:asset_assign_id', authjwt, assetassigncontroller.deleteassetassign);


module.exports = router