const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'dhruvi16.adsum@gmail.com',
        pass: 'ccvzospbswzeufhf'
    }
});

module.exports = transporter;