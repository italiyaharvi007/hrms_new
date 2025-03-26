const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');
const uploadMiddleware = require('../middleware/uploadmiddleware.js');

const workdocumentcontroller = require('../controller/workdocumentcontroller.js');

router.get('/findbyuserid/:user_id',authjwt,workdocumentcontroller.findbyuserid);
router.get('/loginuserworkdocument',authjwt,workdocumentcontroller.loginuserworkdocument);
router.post('/adddocument',authjwt, uploadMiddleware.single('image'),workdocumentcontroller.adddocument);
router.post('/deleteworkdocument/:workdocument_id',authjwt,workdocumentcontroller.deleteworkdocument);

module.exports = router