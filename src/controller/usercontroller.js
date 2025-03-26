var con = require('../../config/hrmsconfig.js');
 const bcrypt = require("bcrypt");
 const jwt = require('jsonwebtoken');
const moment = require('moment');
const nodemailer = require('nodemailer');
var transporter = require('../../config/nodemailer.js')




// GET USER
// exports.findalluser = function (req, res) {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
  
//     const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

//     const query = `SELECT user.*, DATE_FORMAT(user.birth_date,'%d/%m/%Y') AS birth_date, city.city_name,state.state_name,country.country_name, role.role_name, created_by_user.firstname AS created_by FROM user 
//     LEFT JOIN city ON user.city_id = city.city_id
//     LEFT JOIN state ON user.state_id = state.state_id
//     LEFT JOIN country ON user.country_id = country.country_id
//     LEFT JOIN role ON user.role_id = role.role_id 
//     LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id
//     WHERE user.user_id LIKE '%${searchQuery}%' OR city.city_name LIKE '%${searchQuery}%' OR user.fistname LIKE '%${searchQuery}%' OR role.role_name LIKE '%${searchQuery}%'
//     LIMIT ? OFFSET ?`;

//     const countQuery = `SELECT COUNT(*) as total FROM user LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id WHERE user.fistname LIKE '%${searchQuery}%' OR user.official_email LIKE '%${searchQuery}%' OR user.phoneno LIKE '%${searchQuery}%' OR created_by_user.firstname LIKE '%${searchQuery}%'`;

//     con.query(query, [limit, offset], (err, rows, response) => {
//       if (err)
//       {
//         res.status(400).send({ success: false, message: "USER find failed", data: response });
//       }
//       else 
//       {
//         con.query(countQuery, (err, result) => {
//           if (err) 
//           {
//             res.status(404).send({ success: false, message: "USER find failed", data: response });
//           } 
//           else 
//           {
//             const total = result[0].total;
//             const totalPages = Math.ceil(total / limit);
  
//             const prevPage = page > 1 ? page - 1 : null;
//             const nextPage = page < totalPages ? page + 1 : null;

//             res.status(200).send({ success: true, message: "USER find successfully",  data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
//           }
//         });
//       }
//     });
//   }


exports.findalluser = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

  const query = `SELECT user.*, DATE_FORMAT(user.birth_date,'%d/%m/%Y') AS birth_date, city.city_name, state.state_name, country.country_name, role.role_name, created_by_user.firstname AS created_by FROM user 
  LEFT JOIN city ON user.city_id = city.city_id
  LEFT JOIN state ON user.state_id = state.state_id
  LEFT JOIN country ON user.country_id = country.country_id
  LEFT JOIN role ON user.role_id = role.role_id 
  LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id
  WHERE user.user_id LIKE '%${searchQuery}%' OR city.city_name LIKE '%${searchQuery}%' OR user.firstname LIKE '%${searchQuery}%' OR role.role_name LIKE '%${searchQuery}%'
  LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) as total FROM user LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id WHERE user.firstname LIKE '%${searchQuery}%' OR user.official_email LIKE '%${searchQuery}%' OR user.phoneno LIKE '%${searchQuery}%' OR created_by_user.firstname LIKE '%${searchQuery}%'`;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err)
    {
      console.log(err); // log the error object to console
      res.status(400).send({ success: false, message: "USER find failed", data: response });
    }
    else 
    {
      con.query(countQuery, (err, result) => {
        if (err) 
        {
          console.log(err); // log the error object to console
          res.status(404).send({ success: false, message: "USER find failed", data: response });
        } 
        else 
        {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);

          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          res.status(200).send({ success: true, message: "USER find successfully",  data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
        }
      });
    }
  });
}



// FIND ONE
exports.findoneuser = (req,res) =>{
	console.log(req.params);

	con.query('SELECT * FROM user WHERE user_id =?',[req.params.user_id], (err, rows, fields,response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "USER find failed",data: response});
        }
        else
        {
			    let single = (rows.length > 0) ? rows[0] : [];
            res.status(200).send({status:true, message:"Find One USER Successfully", data:single}); 
        }
    });
};





//ADD USER
// exports.adduser = async (req, res) => {
//   let user_data = req.user;
//   console.log(req.file);
//   try {
//     const { name, email, username, password, city_id, address, birth_date, age, gender, role_id, dep_id, contact} = req.body;
//     const { filename: image } = req.file;

//     if (!image) {
//       return res.status(400).json({ message: 'Image file not found' });
//     }

//     // Check if username, email, and contact are already in use
//     const checkUser = await new Promise((resolve, reject) => {
//       con.query('SELECT * FROM user WHERE username = ? OR email = ? OR contact = ?', [username, email, contact], (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     if (checkUser.length > 0) {
//       return res.status(400).json({success: false, message: 'USERNAME, EMAIL, or CONTACT already in use' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = {
//                 name: name,
//                 email: email,
//                 username: username,
//                 password: hashedPassword,
//                 city_id: city_id,
//                 address: address,
//                 birth_date: moment(birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
//                 age: age,
//                 gender: gender,
//                 role_id: role_id,
//                 dep_id: dep_id,
//                 contact: contact,
//                 created_by: user_data.user_id,
//                 image:image,
//                 status: 0
//               };
//     // Insert the user data with the hashed password
//     con.query('INSERT INTO user SET ?', user, (error, results) => {
//       if (error) 
//       {
//         console.error(error);
//         return res.status(400).json({ success: false,message: 'Internal server error' });
//       }
//       res.status(200).json({ success: false, message: 'User Insert successfully', data: {name, email, username, password, city_id, address, birth_date, age, gender, role_id, dep_id, contact,image,status:0}, other: results });
//     });
//   } 
//   catch (err) {
//     console.error(err);
//     res.status(400).json({ success: false, message: 'Internal server error' });
//   }
// };



exports.adduser = async (req, res) => {
  let user_data = req.user;
  console.log(req.file);
  try {
      const { firstname, middlename, lastname, official_email,personal_email,username,password,phoneno,alternet_phoneno,address,pincode,city_id,state_id , country_id , birth_date, age, gender,bloodgroup,marital_status, role_id} = req.body;
      const { filename: image } = req.file;

      if (!image) {
          return res.status(400).json({ message: 'Image file not found' });
      }

      // Check if username, email, and contact are already in use
      const checkUser = await new Promise((resolve, reject) => {
          con.query('SELECT * FROM user WHERE username = ? OR official_email = ? OR personal_email = ? OR phoneno = ? OR alternet_phoneno = ?', [username, official_email,personal_email, phoneno,alternet_phoneno], (error, results) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(results);
              }
          });
      });

      if (checkUser.length > 0) {
          return res.status(400).json({ success: false, message: 'USER-NAME, EMAIL, or PHONE_NO already in use' });
    }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        official_email: official_email,
        personal_email: personal_email,
        username: username,
        password: hashedPassword,
        phoneno:phoneno,
        alternet_phoneno:alternet_phoneno,
        address: address,
        pincode: pincode,
        city_id: city_id,
        state_id:state_id,
        country_id:country_id,
        birth_date: moment(birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        age: age,
        gender: gender,
        bloodgroup: bloodgroup,
        marital_status: marital_status,
        role_id:role_id,
        image: image,
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO user SET ?', user, (error, results) => {
          if (error) {
              console.error(error);
              return res.status(400).json({ success: false, message: 'Internal server error' });
              
          }

          // Send email only if user provided an email address
          if (official_email) {
            const mailOptions = {
                      from: process.env.EMAIL_USER,
                      to: official_email,
                      subject: 'Welcome to HRMS!',
                      html: `<p>Dear ${firstname},</p>
                             <p>Your account has been created on HRMS. Here are your login credentials:</p>
                             <ul>
                                <li>email: ${official_email}</li>
                                <li>Username: ${username}</li>
                                <li>Password: ${password}</li>
                             </ul>
                             <p>Please use the following link to login:</p>
                             <p><a href="http://localhost:1010/userlogin">http://localhost:1010/userlogin</a></p>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                        res.status(400).send({ success: false, message: 'Failed to send email', error: error.message, emailSent: false });

                      } else {
                        console.log('email sent:' + info.response);
                        res.status(200).send({ success: true, message: 'USER add successfully and email sent', data: { firstname, middlename, lastname, official_email,personal_email,username,password,phoneno,alternet_phoneno,address,pincode,city_id,state_id , country_id , birth_date, age, gender,bloodgroup,marital_status, role_id}, other: {Result: results, notificationResult: notificationResult }, emailSent: true });
                      }
                    })
          }
          res.status(200).json({ success: true, message: 'USER add successfully', data: {firstname, middlename, lastname, official_email,personal_email,username,password,phoneno,alternet_phoneno,address,pincode,city_id,state_id , country_id , birth_date, age, gender,bloodgroup,marital_status,role_id, image}, other: results });
      });

  } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'USER add Failed' });
  }
};





//Update USER
exports.updateuser = async (req, res) => {
  console.log(req.body);
  const uid = req.params.user_id;
  const fname = req.body.firstname;
  const mname = req.body.middlename;
  const lname = req.body.lastname;
  const oemail = req.body.official_email;
  const pemail = req.body.personal_email;
  const uname = req.body.username;
  const pno = req.body.phoneno;
  const apno = req.body.alternet_phoneno;
  const add = req.body.address;
  const pincode = req.body.pincode;
  const cityid = req.body.city_id;
  const stateid = req.body.state_id;
  const countryid = req.body.country_id;
  const bdate = req.body.birth_date;
  const age = req.body.age;
  const gender = req.body.gender;
  const bgroup = req.body.bloodgroup;
  const status = req.body.marital_status;
  const roleid = req.body.role_id;
  const image = req.file;

  // Check if email or contact already exists
  const existinguser = await new Promise((resolve, reject) => {
    con.query('SELECT * FROM user WHERE (official_email = ? OR personal_email = ? OR username = ? OR phoneno =  ? OR alternet_phoneno =  ?) AND user_id != ?', [oemail, pemail, uname, pno, apno, uid],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });

  if (existinguser.length > 0) {
    return res.status(400).send({ success: false, message: 'EMAIL, USER-NAME or PHONE-NO already exists' });
  }
  //firstname, middlename, lastname, official_email,personal_email,username,password,phoneno,alternet_phoneno,address,pincode,city_id,state_id, country_id , birth_date, age, gender,bloodgroup,marital_status, role_id,

  try {
    let image = '';
    if (req.file) {
      image = req.file.filename; // Get the filename of the uploaded image
    }

    const result = await new Promise((resolve, reject) => {

      con.query('UPDATE user SET firstname = ?, middlename = ?,lastname = ?, official_email = ?, personal_email = ?, username = ?, phoneno = ?, alternet_phoneno = ?, address =?, pincode = ?, city_id = ?,state_id = ?, country_id =?, birth_date = ?, age=?, gender=?,bloodgroup =?, marital_status = ?, role_id=?, image = ? WHERE user_id = ?',
        [fname, mname, lname, oemail,pemail,uname, pno, apno,add, pincode,cityid, stateid, countryid, bdate, age, gender,bgroup,status,roleid,image, uid], (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });
    res.status(200).send({ success: true, message: 'USER updated successfully', data: {fname, mname, lname, oemail,pemail,uname, pno, apno,add, pincode,cityid, stateid, countryid, bdate, age, gender,bgroup,status,roleid,image, uid }, other: result });
  } catch (error) {
      return res.status(400).send({ success: false, message: 'Internal server error' });
    }
};






//DELETE USER
exports.deleteuser = (req,res) => {
	con.query('DELETE FROM user WHERE user_id =?',[req.params.user_id], (err, rows, response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "USER delete failed",data: response});
        }
        else
        {
			    res.status(200).send({success : true, message: "USER delete successfully",data: response});
        }
    })
};




// FIND BY CITY ID
exports.findbycity = (req,res) =>{
	console.log(req.params);

	con.query('SELECT * FROM user WHERE city_id =?',[req.params.city_id], (err, rows,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "USER find by CITY failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "USER find by CITY successfully",data: rows});
        }
    });
};




// FIND BY ROLE ID
exports.findbyrole = (req,res) =>{
	console.log(req.params);

	con.query('SELECT * FROM user WHERE role_id  =?',[req.params.role_id], (err, rows,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "USER find by ROLE failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "USER find by ROLE successfully",data: rows});
        }
    });
};



// FIND ASSIGN ALL REPORTING
exports.findassignmanager = function (req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const searchQuery = req.query.q || '';

  const query = `SELECT reporting.*, user1.username AS user_name, user2.firstname AS assign_name, user3.*
    FROM reporting
    LEFT JOIN user user1 ON reporting.user_id = user1.user_id 
    LEFT JOIN user user2 ON reporting.assign_id = user2.user_id
    LEFT JOIN user user3 ON reporting.user_id = user3.user_id 
    WHERE repo_id AND reporting.assign_id = ?
    AND (user1.username LIKE ? OR user3.firstname LIKE ?)`;

  const countQuery = `SELECT COUNT(*) as total FROM reporting
    LEFT JOIN user user1 ON reporting.user_id = user1.user_id
    LEFT JOIN user user2 ON reporting.assign_id = user2.user_id
    WHERE repo_id AND reporting.assign_id = ?
    AND (user1.username LIKE ? OR user2.firstname LIKE ?)`;

  con.query(query, [userId, `%${searchQuery}%`, `%${searchQuery}%`], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while retrieving the reporting data' });
    }

    con.query(countQuery, [userId, `%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while retrieving the reporting data' });
      }

      const total = results[0].total;
      const message = `Retrieved ${rows.length} out of ${total} reports`;

      res.status(200).json({ success: true, message, data: rows });
    });
  });
}
