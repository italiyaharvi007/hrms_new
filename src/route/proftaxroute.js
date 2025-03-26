const express = require('express')
const router = express.Router()

const authjwt = require('../middleware/authjwt.js');

const proftaxcontroller =   require('../controller/proftaxcontroller.js');

// Retrieve all items
router.get('/findallsetting',authjwt, proftaxcontroller.findallsetting);
router.post('/addsproftax',authjwt, proftaxcontroller.addsproftax);
router.post('/updateproftax/:id',authjwt, proftaxcontroller.updateproftax);
router.post('/deleteproftax/:id',authjwt, proftaxcontroller.deleteproftax);


module.exports = router