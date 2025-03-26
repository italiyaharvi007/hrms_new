const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');


const notificationcontroller =   require('../controller/notificationcontroller.js');

// Retrieve all items
router.get('/findallnotification',authjwt, notificationcontroller.findallnotification);
router.get('/unreadnotification',authjwt, notificationcontroller.unreadnotification);
router.post('/updatenotification/:not_id', authjwt,notificationcontroller.updatenotification);
router.post('/deletenotification/:not_id',authjwt, notificationcontroller.deletenotification);

router.delete('/deleteselectednotifications', authjwt, notificationcontroller.deleteselectednotifications);
router.post('/deleteallnotification', authjwt, notificationcontroller.deleteallnotification);

router.post('/updateallnotification', authjwt, notificationcontroller.updateallnotification);
router.post('/updateselectednotification', authjwt, notificationcontroller.updateselectednotification);

router.get('/countnotification',authjwt,notificationcontroller.countnotification);
router.get('/countnotallification', authjwt, notificationcontroller.countnotallification);



module.exports = router