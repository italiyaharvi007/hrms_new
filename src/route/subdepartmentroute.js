const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/validationmiddleware.js');
const authjwt = require('../middleware/authjwt.js');

const subdepartmentcontroller =   require('../controller/subdepartmentcontroller.js');

// Retrieve all items
router.get('/findallsubdepartment',authjwt, subdepartmentcontroller.findallsubdepartment);
router.get('/findonesubdepartment/:sub_dep_id',authjwt, subdepartmentcontroller.findonesubdepartment);
router.post('/addsubdepartment',authjwt, subdepartmentcontroller.addsubdepartment);
router.post('/updatesubdepartment/:sub_dep_id',authjwt, subdepartmentcontroller.updatesubdepartment);
router.post('/deletesubdepartment/:sub_dep_id',authjwt, subdepartmentcontroller.deletesubdepartment);



module.exports = router