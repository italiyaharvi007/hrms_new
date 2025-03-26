const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');


const eventcontroller = require('../controller/eventcontroller.js');

// Retrieve all items
router.get('/findallevent',authjwt, eventcontroller.findallevent);
router.get('/findoneevent/:event_id',authjwt, eventcontroller.findoneevent);
router.post('/addevent',authjwt, eventcontroller.addevent);
router.post('/updateevent/:event_id',authjwt, eventcontroller.updateevent);
router.delete('/deleteevent/:event_id',authjwt, eventcontroller.deleteevent);

module.exports = router