var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv").config();
const con = require("./config/hrmsconfig.js");
const cors = require('cors');
var app = express();
const { use } = require('./config/nodemailer.js');



app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

//app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(cors({orgin: 'http://localhost:3000'}));
app.options('*', cors());

const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage
}).single('profile_image');

var server = require('http').Server(app);
app.use(function(req, res, next) {
    req.con = con
    next()
  })

var port = process.env.PORT || 1010;

app.use(bodyParser.json())


// to support URL-encoded bodies
const adminroute = require('./src/route/adminroute.js')
const attendanceroute = require('./src/route/attendanceroute.js')
const cityroute = require('./src/route/cityroute.js')
const countryroute = require('./src/route/countryroute.js')
const departmentroute = require ('./src/route/departmentroute.js')
const projectroute = require('./src/route/projectroute.js');
const  roleroute= require ('./src/route/roleroute.js')
const salaryroute = require('./src/route/salaryroute.js')
const stateroute = require('./src/route/stateroute.js')
const  technologyroute= require ('./src/route/technologyroute.js')
const userroute = require('./src/route/userroute.js')
const authroute = require('./src/route/authroute.js')
const userloginroute = require('./src/route/userloginroute.js')
const leaveroute = require('./src/route/leaveroute.js')
const bankdetailroute = require('./src/route/bankdetailroute.js')
const companyprofileroute = require('./src/route/companyprofileroute.js')
const eventroute = require('./src/route/eventroute.js')
const notificationroute = require('./src/route/notificationroute.js')
const reportingroute = require('./src/route/reportingroute.js')
const managerroute = require('./src/route/managerroute.js')
const subdepartment = require('./src/route/subdepartmentroute.js')
const workroute = require('./src/route/workroute.js')
const educationroute = require('./src/route/educationroute.js')
const assetroute = require('./src/route/assetroute.js')
const assetassignroute = require('./src/route/assetassignroute.js')
const certificationroute = require('./src/route/certificationroute.js')
const idsroute = require('./src/route/idsroute.js')
const workdocumentroute = require('./src/route/workdocumentroute.js')
const taskassignroute = require('./src/route/taskassignroute.js')
const holidayroute = require ('./src/route/holidayroute.js')
const settingroute = require ('./src/route/settingroute.js')
const tdsroute = require('./src/route/tdsroute.js')
const proftaxroute = require('./src/route/proftaxroute.js')
const incometaxroute = require('./src/route/incometaxroute.js')
 


app.use('/admin',adminroute)
app.use('/attendance', attendanceroute)
app.use('/city', cityroute)
app.use('/country', countryroute)
app.use('/department',departmentroute)
app.use('/project',projectroute)
app.use('/role',roleroute)
app.use('/salary', salaryroute)
app.use('/state', stateroute)
app.use('/technology',technologyroute)
app.use('/user', userroute)
app.use('/auth',authroute)
app.use('/userlogin',userloginroute)
app.use('/leave', leaveroute)
app.use('/bankdetail', bankdetailroute)
app.use('/companyprofile', companyprofileroute)
app.use('/event', eventroute)
app.use('/notification', notificationroute)
app.use('/reporting', reportingroute);
app.use('/manager',managerroute);
app.use('/subdepartment',subdepartment);
app.use('/work',workroute);
app.use('/education', educationroute);
app.use('/asset', assetroute);
app.use('/assetassign', assetassignroute);
app.use('/certification', certificationroute);
app.use('/ids', idsroute);
app.use('/workdocument', workdocumentroute);
app.use('/taskassign', taskassignroute);
app.use('/holiday', holidayroute);
app.use('/setting', settingroute);
app.use('/tds', tdsroute);
app.use('/proftax', proftaxroute);
app.use('/incometax', incometaxroute);


// root path
app.get("/", (req, res, next) => {
	res.json("What's up?");
});


server.listen(port, () => {
    console.log('Listening on port: ' + port);
});