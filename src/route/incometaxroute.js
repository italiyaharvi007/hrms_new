const express = require('express')
const router = express.Router()

const authjwt = require('../middleware/authjwt.js');

const incometaccontroller =   require('../controller/incometaxcontroller.js');

// Retrieve all items
router.get('/findallincometax',authjwt, incometaccontroller.findallincometax);
router.post('/addincometax',authjwt, incometaccontroller.addincometax);
router.post('/updateincometax/:id',authjwt, incometaccontroller.updateincometax);
router.post('/deleteincometax/:id',authjwt, incometaccontroller.deleteincometax);


module.exports = router