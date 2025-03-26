const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const attendancecontroller =   require('../controller/attendancecontroller.js');

// Retrieve all items
router.get('/findallattendance',authjwt, attendancecontroller.findallattendance);
router.get('/findoneattendance/:user_id/:intime',authjwt, attendancecontroller.findoneattendance);
router.post('/addattendance',authjwt, validator.validateinsertattendance,othervalidation, attendancecontroller.addattendance);
router.delete('/deleteattendance/:attendance_id',authjwt, attendancecontroller.deleteattendance);
router.get('/findbyuser/:user_id',authjwt,attendancecontroller.findbyuser);
router.get('/loginusermonthlyreport',authjwt,attendancecontroller.loginusermonthlyreport);
router.get('/dailyattendance', authjwt, attendancecontroller.dailyattendance);
router.get('/usermonthlyreport/:user_id',authjwt,attendancecontroller.usermonthlyreport);
router.get('/alluserdailyattendance', authjwt, attendancecontroller.alluserdailyattendance);
router.get('/attendanceexportpdf', authjwt, attendancecontroller.attendanceexportpdf);

module.exports = router