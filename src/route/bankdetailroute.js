const express = require('express')
const router = express.Router()
const {validator} = require('../middleware/othervalidation.js');
const {othervalidation} = require('../middleware/othervalidation.js');
// const {validator} = require('../middleware/othervalidation.js');
// const {othervalidation} = require('../middleware/othervalidation.js');
const authjwt = require('../middleware/authjwt.js');

const bankdetailcontroller =   require('../controller/bankdetailcontroller.js');

// Retrieve all items
router.get('/findallbankdetail',authjwt, bankdetailcontroller.findallbankdetail);
router.get('/findonebankdetail/:bank_id',authjwt, bankdetailcontroller.findonebankdetail);
router.post('/addbankdetail',authjwt, bankdetailcontroller.addbankdetail);
router.post('/updatebankdetail/:bank_id',authjwt, bankdetailcontroller.updatebankdetail);
router.delete('/deletebankdetail/:bank_id',authjwt, bankdetailcontroller.deletebankdetail);
router.get('/loginuserbankdetail',authjwt,bankdetailcontroller.loginuserbankdetail);
router.get('/bankdetailexportpdf',authjwt, bankdetailcontroller.bankdetailexportpdf);

module.exports = router