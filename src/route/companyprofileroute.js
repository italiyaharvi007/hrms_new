const express = require('express')
const router = express.Router()
const authjwt = require('../middleware/authjwt.js');
const pdfmiddleware = require('../middleware/pdfmiddlware.js')

const compnayprofilecontroller =   require('../controller//companyprofilecontroller.js');

// Retrieve all items
// router.get('/findallcity',authjwt, compnayprofilecontroller.findallcity);
// router.get('/findonecity/:city_id',authjwt, compnayprofilecontroller.findonecity);

router.get('/findallcompnayprofile', authjwt, compnayprofilecontroller.findallcompnayprofile);
router.get('/findonecompnayprofile/:company_id', authjwt,compnayprofilecontroller.findonecompnayprofile);
// router.post('/addcompanyprofile',authjwt,pdfmiddleware.single('pdf'), compnayprofilecontroller.addcompanyprofile);
// router.post('/updatecompanyprofile/:company_id',authjwt, compnayprofilecontroller.updatecompanyprofile);

router.post('/addcompanyprofile',authjwt, pdfmiddleware.fields([
    { name: 'image', maxCount: 1 },
    { name: 'company_policy', maxCount: 1 },
    { name: 'moonlight_policy', maxCount: 1 },
    { name: 'tour_policy', maxCount: 1 },
    { name: 'yearlyleave_policy', maxCount: 1 }
]), compnayprofilecontroller.addcompanyprofile);

router.post('/updatecompanyprofile/:company_id', authjwt, pdfmiddleware.fields([
    { name: 'image', maxCount: 1 },
    { name: 'company_policy', maxCount: 1 },
    { name: 'moonlight_policy', maxCount: 1 },
    { name: 'tour_policy', maxCount: 1 },
    { name: 'yearlyleave_policy', maxCount: 1 }
]), compnayprofilecontroller.updatecompanyprofile);

router.post('/deletecompnayprofile/:company_id',authjwt, compnayprofilecontroller.deletecompnayprofile);

module.exports = router