const express = require('express')
const router = express.Router()


const managercontroller =   require('../controller/managercontroller.js');

// Retrieve all items
router.get('/allinterndailyattendancetotal', managercontroller.allinterndailyattendancetotal);

module.exports = router