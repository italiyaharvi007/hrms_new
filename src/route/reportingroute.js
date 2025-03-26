const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');

const reportingcontroller =  require('../controller/reportingcontroller.js');

// Retrieve all items
router.get('/findallreporting', authjwt, reportingcontroller.findallreporting);
router.get('/findonereporting/:repo_id',authjwt,reportingcontroller.findonereporting);
router.get('/findallasignreporting',authjwt, reportingcontroller.findallasignreporting);
router.get('/findoneassignuser/:assign_id',authjwt, reportingcontroller.findoneassignuser);
router.post('/adddreporting',authjwt,reportingcontroller.adddreporting);
router.post('/updatereporting/:repo_id',authjwt, reportingcontroller.updatereporting);
router.post('/deletereporting/:repo_id',authjwt, reportingcontroller.deletereporting);

router.get('/findbyleave', authjwt, reportingcontroller.findbyleave);
router.get('/findbyuserid/:user_id',authjwt,reportingcontroller.findbyuserid);

router.get('/findbyattendance',authjwt,reportingcontroller.findbyattendance);
router.get('/usermonthlyreport/:user_id',authjwt,reportingcontroller.usermonthlyreport);
router.get('/userdailyreport/:user_id', authjwt, reportingcontroller.userdailyreport);
router.get('/allinterndailyattendance',authjwt, reportingcontroller.allinterndailyattendance);

module.exports = router