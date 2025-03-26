const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');


const leavecontroller = require('../controller/leavecontroller.js');

// Retrieve all items

router.get('/findallleave',authjwt, leavecontroller.findallleave);
router.get('/findoneleave/:leave_id',authjwt, leavecontroller.findoneleave);
router.post('/addleave',authjwt, leavecontroller.addleave);
router.post('/updateleave/:leave_id',authjwt, leavecontroller.updateleave);
router.delete('/deleteleave/:leave_id',authjwt, leavecontroller.deleteleave);
router.get('/getleavebyloginuser',authjwt,leavecontroller.getleavebyloginuser);
router.get('/getleavebyuser/:user_id', authjwt, leavecontroller.getleavebyuser);

module.exports = router