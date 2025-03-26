const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
//const{validationResult} = require('express-validator');

const bcrypt = require("bcrypt");
var con = require('../../config/hrmsconfig.js');

//FORGET PASSWORD
const nodemailer = require('nodemailer');

// REGISTER ADMIN
exports.register = async (req, res) => {
    try {
        const { admin_name, email, contact, user_name, password, city_id, address} = req.body;
        const existingAdmin = await new Promise((resolve, reject) => {
            con.query('SELECT * FROM admin WHERE email = ? OR contact = ? OR user_name = ?', [email, contact, user_name], (error, results) => {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(results);
                }
            });
        });

        if (existingAdmin.length > 0) {
            //res.send('Email or contact already taken');
            res.send({success: false,message: 'EMAIL, USER-NAME or CONTACT already taken'});
        } 
        else 
        {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            const newAdmin = {
                admin_name: admin_name,
                email: email,
                contact: contact,
                user_name: user_name,
                password: hashedPassword,
                city_id: city_id,
                address: address
            };

            // Insert new admin into database
            con.query('INSERT INTO admin SET ?', newAdmin, (error, results) => {
                if (error) 
                {
                    console.log(error);
                    res.status(400).send({success: false,message: 'ADMIN registration failed',data: error.message});
                }
                else 
                {
                    res.status(200).send({success: true,message: 'ADMIN register successful',data: results});
                }
            });
        }
    } 
    catch (error) 
    {
        res.status(400).send({success: false,message: 'ADMIN registration failed',data: error.messag});
    }
};



// LOGIN ADMIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) 
        {
            res.status(404).json({ status: 400, success: false, message: 'Please Provide an EMAIL and PASSWORD' });
        }
        con.query('SELECT * FROM admin WHERE email = ?', [email], async (err, results) => {
            
            const npassword = results[0].password
            
            console.log(npassword)
            if (results)
            {
                // const ischeck = await bcrypt.compare(password, npassword)
                    if (results && await bcrypt.compare(password, results[0].password)){
                    // const id = results[0].id;
                    const token = jwt.sign({  }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES
                        });
                        console.log(token);
                        const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('userSave', token, cookieOptions);
                    res.json({ status: 200, success: true, message: 'LOG-IN successfully',token });
                } 
                else 
                {
                    res.json({ status: 400, success: false, message: 'invalid' });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
}



// LOG OUT
exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.json({ status: 200, success: true, message: 'LOG-OUT successfully' });
}



//FORGET PASSWORD
 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
 })
 exports.forgetpass = async (req,res) => {
    const admin = req.body;
    query = "SELECT email, password FROM admin WHERE email =?";
    con.query(query,[admin.email],(err,results) => {
        if(!err)
        {
            if(results.length <= 0)
            {
                return res.status(200).json({message: "PASSWORD sent successfully to your EMAIL"});
            }
            else
            {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by HRMS ',
                    html: '<p><b>Your login detail for HRMS</b></p><b>email:</b>'+results[0].email+'<br><b>password:</b>'+results[0].password+'</br><a href="http://localhost:1010/">click here to LOGIN></a></p>'
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        console.log('email sent:' + info.response);
                    }
                });
            }
        }
        else
        {
            return res.status(400).json(err);
        }
    })
 }



 // SIMPLE RESET PASSWORD
 exports.resetpassword = async(req,res)=>{
    const email = req.body.email;
    const npassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if(npassword == confirmpassword)
    {
        let hashedPassword = await bcrypt.hash(npassword, 8);
            console.log(hashedPassword);
        con.query('UPDATE admin SET password = ? WHERE email = ?',[hashedPassword,email],(err,results)=>{
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.status(200).send({ message: 'RESET successfully'})
            }
        })
    }
    else
    {
        res.status(400).send({ message: 'PASSWORD and CONFIRM-PASSWORD dose not match'})
    }
}



// //RESET PASSWORD USING EMAIL
exports.PasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email)
    {
        con.query('SELECT * FROM admin WHERE email =?', email, (err, rows) => {
            console.log(rows[0].admin_id);
            if (rows) 
            {
                const secret = rows[0].admin_id + process.env.JWT_SECRET
                console.log("secret", secret)
                const token = jwt.sign({ adminID: rows[0].admin_id }, secret, { expiresIn: '15m' })
                console.log("token", token)
                const link = `http://localhost:1010/auth/resetpassword/${rows[0].admin_id}/${token}`
                console.log("link", link);
                // transporter.sendMail({
                //     from:process.env.EMAIL_FROM,
                //     to:email,
                //     subject:"HRMS - Password Reset Link",
                //     html:`<a href=${link}>Click Here</a> to reset your password`
                // })
                res.send({ "status": "failed", "message": "PASSWORD reset EMAIL Sent... Please check your EMAIL" })
            } 
            else 
            {
                res.send({ "status": "failed", "message": "EMAIL dosen't exists" })
            }
        })
    } 
    else 
    {
        res.send({ "status": "failed", "message": "Email field is required" })
    }
}



//RESET PASSWORD USING TOKEN
exports.resetpasswordtoken = async (req, res) => {
    const npassword = req.body.password;
    // const nemail = req.body.email;
    const confirmpassword = req.body.confirmpassword;
    const { admin_id, token } = req.params
    const new_secret = admin_id + process.env.JWT_SECRET
    console.log("new_secret", new_secret)
    if (npassword == confirmpassword) 
    {
        jwt.verify(token, new_secret)
        let hashedPassword = await bcrypt.hash(npassword, 8);
        console.log(hashedPassword);
        con.query( 'UPDATE admin SET password = ? WHERE admin_id = ?', [hashedPassword, admin_id], (err, results) => {
            if (err) 
            {
                console.log(err)
            }
            else
            {
                res.status(200).send({ message: 'RESET successfully'})
            }
        })
    } 
    else 
    {
        res.status(400).send({ message: 'PASSWORD And CONFIR-MPASSWORD does not match' })
    }
}

