const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');
const uploadMiddleware = require('../middleware/uploadmiddleware.js');

const certificationcontroller = require('../controller/certificationcontroller.js');

router.get('/loginusercertificare',authjwt,certificationcontroller.loginusercertificare);
router.get('/findbyuserid/:user_id',authjwt,certificationcontroller.findbyuserid);
router.post('/addcertification',authjwt, uploadMiddleware.single('image'),certificationcontroller.addcertification);
router.post('/updatecertification/:certification_id',authjwt,certificationcontroller.updatecertification);
router.post('/deletecertification/:certification_id',authjwt,certificationcontroller.deletecertification);

module.exports = router