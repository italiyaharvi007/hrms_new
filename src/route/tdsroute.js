const express = require('express')
const router = express.Router()

const authjwt = require('../middleware/authjwt.js');

const tdscontroller =   require('../controller/tdscontroller.js');

// Retrieve all items

router.get ('/findalltds', authjwt, tdscontroller.findalltds);
router.post('/addtds',authjwt, tdscontroller.addtds);
router.post ('/updatetds:/id', authjwt, tdscontroller.updatetds);

module.exports = router