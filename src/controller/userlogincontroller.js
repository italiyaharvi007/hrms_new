const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var transporter = require('../../config/nodemailer.js')


var con = require('../../config/hrmsconfig.js');

// USER LOGIN
{ // SIMPLE LOGIN :-

// exports.userlogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log(email, password)
//         if (!email || !password) 
//         {
//             res.status(400).json({ status: 400, success: false, message: 'Please Provide an EMAIL and PASSWORD' });
//         }
//         con.query('SELECT * FROM user WHERE email = ?', [email] , async (err, results) => {
//             console.log("results[0]",results[0])
//             const newpassword = results[0].password
            
//             if (results) 
//             {
//                 // const ischeck = await bcrypt.compare(password, npassword)
//                     // if (results && await bcrypt.compare(password, results[0].password)){
//                     if (password === newpassword)
//                     {
//                         const id = results[0].id;
//                         const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                         expiresIn: process.env.JWT_EXPIRES
//                     });
//                     console.log(token);
//                     const cookieOptions = {
//                     expires: new Date(
//                         Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                     ),
//                     httpOnly: true
//                     }
//                     res.cookie('userSave', token, cookieOptions);
//                     res.status(200).json({status:200, message: 'LOG-IN successfully',token,results});
//                 } 
//                 else 
//                 {
//                     res.status(400).json({ status: 400, success: false, message: 'invalid', });
//                 }
//             }
//         })
//     } catch (err) {
//         console.log(err);
//     }
// }
}

// exports.userlogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log(email, password);
//         if (!email || !password) {
//             return res.status(400).send({status:false, message: "Please provide an email and password"});
//         }
//         con.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
//             // console.log("results[0]", results[0]);
//             const hashedPassword = results[0].password;
//             if (results) {
//                 // Check if the password is correct
//                 const isMatch = await bcrypt.compare(password, hashedPassword);
//                 if (isMatch) {
//                     const id = results[0].id;
//                     const role_id = results[0].role_id;
//                     // Retrieve the role of the user based on their role_id
//                     con.query('SELECT * FROM role WHERE role_id = ?', [role_id], async (err, roleResults) => {
//                         if (roleResults) {
//                             const id = results[0].id;
//                             const user_id = results[0].user_id;
//                             const role = roleResults[0].name;
//                             const token = jwt.sign({ userId: user_id, role }, process.env.JWT_SECRET, {
//                                 expiresIn: process.env.JWT_EXPIRES,
//                             });
//                             console.log("token", token);
//                             const cookieOptions = {
//                                 expires: new Date(
//                                     Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                                 ),
//                                 httpOnly: true,
//                                 secure: true // Set the cookie as secure to prevent it from being sent over an insecure connection
//                             };
//                             res.cookie('userSave', token, cookieOptions);
//                             res.status(200).send({status:true, message: 'Login successful', token, roleResults });
//                         } else {
//                             res.status(400).send({status:false, message: 'Role not found' });
//                         }
//                     });
//                 } else {
//                     res.status(400).send({status:false, message: 'Invalid password' });
//                 }
//             } else {
//                 res.status(400).send({status:false, message: 'User not found' });
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// };


// exports.userlogin = async (req, res) => {
//     try {
//         const { official_email, password } = req.body;
//         console.log(official_email, password);
//         if (!official_email || !password) {
//             return res.status(400).send({
//                 message: "Please provide an email and password"
//             });
//         }
//         con.query('SELECT * FROM user WHERE official_email = ?', [official_email], async (err, results) => {
//             // console.log("results[0]", results[0]);
//             if (!results || results.length === 0) {
//                 return res.status(400).send({ message: 'User not found' });
//             }
//             const hashedPassword = results[0].password;
//             // Check if the password is correct
//             const isMatch = await bcrypt.compare(password, hashedPassword);
//             if (!isMatch) {
//                 return res.status(400).send({ message: 'Invalid password' });
//             }
//             console.log(results[0].status)
//             if (results[0].status == 'block') {
//                 return res.status(401).send({ message: "User account is locked" });
//             }
//             // Update user status to 1 for active user, 2 for blocked user
//             const newStatus = results[0].status === 1 ? 1 : 2; // If current status is 1, set new status to 1, else set it to 2
//             con.query('UPDATE user SET status = ? WHERE official_email = ?', [newStatus, official_email], async (err, updateResults) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send({ message: "Internal server error" });
//                 }
//                 // Retrieve the role of the user based on their role_id
//                 con.query('SELECT * FROM role WHERE role_id = ?', [results[0].role_id], async (err, roleResults) => {
//                     if (roleResults) {
//                         const user_id = results[0].user_id;
//                         const role = roleResults[0].name;
//                         const token = jwt.sign({ userId: user_id, role }, process.env.JWT_SECRET, {
//                             expiresIn: process.env.JWT_EXPIRES,
//                         });
//                         console.log("token", token);
//                         const cookieOptions = {
//                             expires: new Date(
//                                 Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                             ),
//                             httpOnly: true,
//                             secure: true // Set the cookie as secure to prevent it from being sent over an insecure connection
//                         };
//                         res.cookie('userSave', token, cookieOptions);
//                         res.status(200).send({ message: 'Login successful', token, user_id, roleResults });
//                     } else {
//                         res.status(400).send({ message: 'Role not found' });
//                     }
//                 });
//             });
//         });
//     } catch (err) {
//         console.log(err);
//     }
// };

exports.userlogin = async (req, res) => {
    try {
        const { official_email, password } = req.body;
        console.log(official_email, password);
        if (!official_email || !password) {
            return res.status(400).send({
                message: "Please provide an email and password"
            });
        }
        con.query('SELECT * FROM user WHERE official_email = ?', [official_email], async (err, results) => {
            // console.log("results[0]", results[0]);
            if (!results || results.length === 0) {
                return res.status(400).send({ message: 'User not found' });
            }
            const hashedPassword = results[0].password;
            // Check if the password is correct
            const isMatch = await bcrypt.compare(password, hashedPassword);
            if (!isMatch) {
                return res.status(400).send({ message: 'Invalid password' });
            }
            console.log(results[0].status)
            if (results[0].status == 'block') {
                return res.status(401).send({ message: "User account is locked" });
            }
            // Update user status to 1 for active user, 2 for blocked user
            const newStatus = results[0].status === 1 ? 1 : 2; // If current status is 1, set new status to 1, else set it to 2
            con.query('UPDATE user SET status = ? WHERE official_email = ?', [newStatus, official_email], async (err, updateResults) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Internal server error" });
                }
                // Retrieve the role of the user based on their role_id
                con.query('SELECT * FROM role WHERE role_id = ?', [results[0].role_id], async (err, roleResults) => {
                    if (roleResults) {
                        const user_id = results[0].user_id;
                        const role = roleResults[0].name;
                        const token = jwt.sign({ userId: user_id, role }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES,
                        });
                        console.log("token", token);
                        const cookieOptions = {
                            expires: new Date(
                                Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly: true,
                            secure: true // Set the cookie as secure to prevent it from being sent over an insecure connection
                        };
                        res.cookie('userSave', token, cookieOptions);
                        res.status(200).send({ message: 'Login successful', token, user_id, roleResults });
                    } else {
                        res.status(400).send({ message: 'Role not found' });
                    }
                }); 
            });
        });
    } catch (err) {
        console.log(err);
    }
};



exports.loggedUser = async (req, res) => {
    res.send({ "user": req.user })
}

exports.loggedUsercreatedby = async (req, res) => {
    res.send({ "user": req.user.name })
}




// (USER) LOG-OUT
exports.userlogout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).send({status:true, message: 'User LOG-OUT successfully' });
}




// RESET PASSWORD (USER)- SIMPLE
exports.userresetpassword = async(req,res)=>{
    const official_email = req.body.official_email;
    const npassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if(npassword == confirmpassword)
    {
        let hashedPassword = await bcrypt.hash(npassword, 8);
            console.log(hashedPassword);
        con.query('UPDATE user SET password = ? WHERE official_email = ?',[hashedPassword,official_email],(err,results)=>{
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.status(200).send({status:true, message: 'PASSWORD RESET successfully'})
            }
        })
    }
    else
    {
        res.status(400).send({status:false, message: 'PASSWORD and CONFIRM-PASSWORD dose not match'})
    }
}





//FORGET PASSWORD
exports.forgotpassword = async (req, res) => {
    const official_email = req.body.official_email;
    const user = req.body;
    query = "SELECT official_email, password FROM user WHERE official_email =?";
    con.query(query, [user.official_email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "PASSWORD sent successfully to your EMAIL" });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: results[0].official_email,
                    subject: 'Password by HRMS ',
                    html: '<p><b>Your login detail for HRMS</b></p><b>email:</b>' + results[0].official_email +'</br><br><a href="http://localhost:1010/userlogin/simpleresetpassword">click here to LOGIN></a></p>'
                };
                // transporter.sendMail(mailOptions, function (error, info) {
                //     if (error) {
                //         console.log(error);
                //     }
                //     else {
                //         console.log('email sent:' + info.response);
                //     }
                // });
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                      res.status(400).send({ success: false, message: 'Failed to send email', error: error.message, emailSent: false });
                    } else {
                      console.log('email sent:' + info.response);
                      res.status(200).send({ success: true, message: 'FORGOT PASSWORD successfully and email sent', data: { official_email }, other: { results }, emailSent: true });
                    }
                  })
            }
            res.status(200).send({ success: true, message: 'FORGOT PASSWORD successfully and email sent', data: { official_email }, other: { results }, emailSent: true });
        }
        else {
            return res.status(400).json(err);
        }
    })
}






// RESET PASSWORD (USING EMAIL)
exports.resetpasswordemail = async (req, res) => {
    const official_email = req.body.official_email;
    const npassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (npassword == confirmpassword) {
        let hashedPassword = await bcrypt.hash(npassword, 8);
        console.log(hashedPassword);
        con.query('UPDATE user SET password = ? WHERE official_email = ?', [hashedPassword, official_email], (err, results) => {
            if (err) {
                console.log(err)
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: official_email,
                    subject: 'Password by HRMS ',
                    html: '<p><b>Your Password RESET successfully in HRMS</b></p><b>email:</b>' + official_email + '<br><b>password:</b>' + npassword + '</br><p>Your password has been successfully reset.</p><a href="http://localhost:1010/userlogin/userresetpassword/${user.user_id}/">click here to LOGIN</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.status(200).send({ message: 'Password reset successfully' })
                        console.log('email sent:' + info.response);
                    }
                });
            }
        })
    }
    else {
        res.status(400).send({ message: 'Password and Confirm-Password dose not match' })
    }
}







// SIMPLE RESET PASSWORD ( WOTHOUT TOKEN AND AUTHJWT )
exports.simpleresetpassword = async (req, res) => {
    const official_email = req.body.official_email;
    const npassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (npassword == confirmpassword) {
        let hashedPassword = await bcrypt.hash(npassword, 8);
        console.log(hashedPassword);
        con.query('UPDATE user SET password = ? WHERE official_email = ?', [hashedPassword, official_email], (err, results) => {
            if (err) {
                console.log(err)
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: official_email,
                    subject: 'Password by HRMS ',
                    html: '<p><b>Your Password RESET successfully in HRMS</b></p><b>email:</b>' + official_email + '<br><b>password:</b>' + npassword + '</br><p>Your password has been successfully reset.'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('email sent:' + info.response);
                    }
                });
                res.status(200).send({ message: 'Password reset successfully' })
            }
        })
    }
    else {
        res.status(400).send({ message: 'Password and Confirm-Password dose not match' })
    }
}
