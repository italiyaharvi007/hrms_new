const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const workcontroller =   require('../controller/workcontroller.js');

// Retrieve all items
router.get('/getwork',authjwt, workcontroller.getwork);
router.get('/getonework/:work_id',authjwt, workcontroller.getonework);
router.post('/addwork',authjwt, workcontroller.addwork);

router.post('/updatebasicinfo/:work_id',authjwt, workcontroller.updatebasicinfo);
router.post('/updatworkinfo/:work_id', authjwt, workcontroller.updatworkinfo);
router.post('/updatworkhistory/:work_id', authjwt, workcontroller.updatworkhistory);
router.post('/updateresignation/:work_id', authjwt, workcontroller.updateresignation);
router.post('/terminateuser/:work_id', authjwt, workcontroller.terminateuser);

router.post('/deletework/:work_id',authjwt, workcontroller.deletework);

module.exports = router
