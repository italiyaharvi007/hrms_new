const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');

const taskassigncontroller =  require('../controller/taskcontroller.js');

// Retrieve all items

router.get('/findalltask', authjwt, taskassigncontroller.findalltask);
router.get('/findonetask/:task_id', authjwt, taskassigncontroller.findonetask);
router.post('/addtask',authjwt, taskassigncontroller.addtask);
router.post('/updatetask/:task_id', authjwt, taskassigncontroller.updatetask);
router.post('/deletetask/:task_id', authjwt, taskassigncontroller.deletetask);

module.exports = router