const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');
const uploadMiddleware = require('../middleware/uploadmiddleware.js');

const idscontroller = require('../controller/idscontroller.js');

router.get('/findbyuserid/:user_id',authjwt, idscontroller.findbyuserid);
router.post('/addids',authjwt, uploadMiddleware.single('image'),idscontroller.addids);
router.post('/updateids/:ids_id', authjwt,uploadMiddleware.single('image'), idscontroller.updateids);
router.post('/deleteids/:ids_id', authjwt, idscontroller.deleteids);
router.post('/updateverification/:ids_id', authjwt, idscontroller.updateverification);
router.get('/loginuserids', authjwt, idscontroller.loginuserids);

module.exports = router
