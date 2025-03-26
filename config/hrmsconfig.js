const mysql = require('mysql');
require("dotenv").config()

var con = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER_NAME,
	password: process.env.USER_PASSWORD,
	database: process.env.DATABASE
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected to MySQL!");
});

module.exports = con;