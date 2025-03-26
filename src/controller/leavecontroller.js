var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const { query } = require('express');
const jwt = require('jsonwebtoken');
var transporter = require('../../config/nodemailer.js');
const nodemailer = require('nodemailer');



// GET LEAVE
// exports.findallleave = (req,res) =>{

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

//   const query = `SELECT leave.*, user.name
//       FROM leave
//       LEFT JOIN user ON leave.user_id = user.user_id
//       WHERE leave.leave_id LIKE '%${searchQuery}%' OR city.user_id LIKE '%${searchQuery}%'
//       LIMIT ? OFFSET ?`;
        
// 	con.query(query,[limit, offset], (err, rows,response) => {
//         if(err)
//         {
//           //console.log(rows);
// 			    res.status(400).send({success : false, message: "Leave find failed",data: response});
//         }
//         else
//         {
// 			    res.status(200).send(rows);

//           if (err) {
//             res.status(400).send({ success: false, message: "CITY find failed", data: response });
//           } 
//           else 
//           {
//             const total = result[0].total;
//             const totalPages = Math.ceil(total / limit);
  
//             const prevPage = page > 1 ? page - 1 : null;
//             const nextPage = page < totalPages ? page + 1 : null;
  
//             res.status(200).send({ data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
//           }
//         }
//     });
// };

exports.findallleave = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const query ='SELECT `leave`.*, DATE_FORMAT(start_date,"%d/%m/%Y") AS start_date,DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date, user.firstname FROM `leave` LEFT JOIN user ON `leave`.user_id = user.user_id LIMIT ?, ?';

  const countQuery = 'SELECT COUNT(*) as total FROM `leave`';


  con.query(countQuery, (err, result, fields) => {
      if (err) {
          res.status(400).send({ success: false, message: "LEAVE find failed", data: null });
      } else {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);
          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          con.query(query, [offset, limit], (err, rows, fields) => {
              if (err) {
                  res.status(400).send({ success: false, message: "LEAVE find failed", data: null });
              } else {
                  res.status(200).send({ success: true, message: "LEAVE find successfully", data: rows,pagination: {total,page,limit,totalPages,prevPage,nextPage}});
              }
          });
      }
  });
};





//GET-ONE LEAVE
exports.findoneleave = (req, res) => {
  con.query('SELECT `leave`.*, DATE_FORMAT(start_date, "%d/%m/%Y") AS start_date, DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date, user.firstname FROM `leave` LEFT JOIN user ON `leave`.user_id = user.user_id WHERE `leave`.leave_id = ?', [req.params.leave_id], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "LEAVE find failed", data: response });
    } else {
      let single = (rows.length > 0) ? rows[0] : {};
      res.status(200).send({ success: true, message: "Find One LEAVE Successfully", data: single });
    }
  });
};





// ADD LEAVE
// exports.addleave = async (req, res) => {
//   try {
//     const { tittle, user_id, start_date, end_date, days } = req.body;
//     const leave_id = req.params.leave_id;
//     let user_data = req.user;

//     // Get current date
//     const currentDate = new Date();

//     // Check if start date and end date are after current date
//     if (new Date(start_date) < currentDate || new Date(end_date) < currentDate) {
//       res.status(400).send({ success: false, message: 'START-DATE and END-DATE must be after CURRENT-DATE.' });
//       return;
//     }

//     // Check if end date is after start date
//     if (new Date(start_date) > new Date(end_date)) {
//       res.status(400).send({ success: false, message: 'END-DATE must be after START-DATE.' });
//       return;
//     }

//     // Check if leave record already exists
//     const existingLeave = await new Promise((resolve, reject) => {
//       con.query('SELECT * FROM `leave` WHERE user_id = ? AND start_date = ? AND end_date = ?', [user_data.user_id, start_date, end_date],
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });

//     if (existingLeave.length > 0) {
//       // Leave record already exists
//       res.status(400).send({ success: false, message: 'LEAVE record already exists for the given dates.' });
//       return;
//     }

//     // Insert new project into database
//     const result = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO `leave` SET ?', { user_id: user_data.user_id, tittle, start_date, end_date, days },
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });

//   // Insert notification into notifications table
//    const notificationMessage = `New leave request from User ${user_data.name}.`;
//    const adminId = "1";
//     const notificationResult = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO notification SET ?', { from_id: user_data.user_id, to_id:adminId, type: 'leave', message: notificationMessage, is_read: 0, req_id: result.insertId},
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });  


//   res.status(200).send({ success: true, message: 'LEAVE inserted successfully', data: { user_id: user_data.user_id, tittle, start_date, end_date, days }, other: { leaveResult: result, notificationResult: notificationResult }});
//   } catch (error) {
//     res.status(500).send({ success: false, message: 'LEAVE insert failed', error: error.message });
//   }
// };


// exports.addleave = async (req, res) => {
//   try {
//     const { tittle, user_id, start_date, end_date, days } = req.body;
//     const leave_id = req.params.leave_id;
//     let user_data = req.user;

//     // Get current date
//     const currentDate = new Date();

//     // Check if start date and end date are after current date
//     if (new Date(start_date) < currentDate || new Date(end_date) < currentDate) {
//       res.status(400).send({ success: false, message: 'Start date and end date must be after current date.' });
//       return;
//     }

//     // Check if end date is after start date
//     if (new Date(start_date) > new Date(end_date)) {
//       res.status(400).send({ success: false, message: 'End date must be after start date.' });
//       return;
//     }

//     // Check if leave record already exists
//     const existingLeave = await new Promise((resolve, reject) => {
//       con.query('SELECT * FROM `leave` WHERE user_id = ? AND start_date = ? AND end_date = ?', [user_data.user_id, start_date, end_date],
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//             res.status(200).send({ success: true, message: 'LEAVE added successfully.',data:{ tittle, start_date, end_date,days} });
//           }
//         });
//     });

//     if (existingLeave.length > 0) {
//       // Leave record already exists
//       res.status(400).send({ success: false, message: 'Leave record already exists for the given dates.' });
//       return;
//     }

//     // Insert new project into database
//     const result = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO `leave` SET ?', { user_id: user_data.user_id, tittle, start_date, end_date, days },
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });

//     const userEmailResult = await new Promise((resolve, reject) => {
//       con.query('SELECT reporting.*, user.email FROM reporting LEFT JOIN user ON reporting.user_id = user.user_id WHERE reporting.user_id ', [user_id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           if (result.length > 0) { // check if there are any rows in the result array
//             resolve(result[0].email);
//           } else {
//             reject(new Error(`No email found for user_id ${user_id}`)); // reject with an error message
//           }
//         }
//       });
//     });
//     console.log(userEmailResult);


//     // Get admin email
//     const adminEmailResult = await new Promise((resolve, reject) => {
//       con.query('SELECT email FROM user WHERE role_id = ?', [3], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result[0].email);
//         }
//       });
//     });
//     console.log(adminEmailResult);


//     // Send email to user with user_id
//     if (userEmailResult) {
//       const userMailOptions = {
//         from: process.env.EMAIL_USER,
//         to: userEmailResult,
//         subject: 'Leave Request Confirmation',
//         html: `<p>Hello,</p>
//              <p>Your leave request has been submitted successfully.</p>
//              <p>Leave Details:</p>
//              <ul>
//                <li>Title: ${tittle}</li>
//                <li>Start Date: ${start_date}</li>
//                <li>End Date: ${end_date}</li>
//                <li>Number of Days: ${days}</li>
//              </ul>`
//       };
//       transporter.sendMail(userMailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else
//         {
//           console.log('email sent:' + info.response);
//         }
//       })
//     }

//     if (adminEmailResult) {
//       const adminMailOptions = {
//         from: process.env.EMAIL_USER,
//         to: adminEmailResult,
//         subject: 'Leave Request Confirmation',
//         html: `<p>Hello </p>
//              <p>Your leave request has been submitted successfully.</p>
//              <p>Leave Details:</p>
//              <ul>
//                <li>Title: ${tittle}</li>
//                <li>Start Date: ${start_date}</li>
//                <li>End Date: ${end_date}</li>
//                <li>Number of Days: ${days}</li>
//              </ul>`
//       };
//       transporter.sendMail(adminMailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else
//         {
//           console.log('email sent:' + info.response);
//         }
//       })
//     }
//   }
//   catch(error) {
//     console.log(error);
//     res.status(400).send({ success: false, message: 'Leave insert failed', error: error.message });
//   }
// }




// exports.addleave = async (req, res) => {
//   try {
//     const { tittle, user_id, start_date, end_date, days } = req.body;
//     const leave_id = req.params.leave_id;
//     let user_data = req.user;

//     // Get current date
//     const currentDate = new Date();

//     // Check if start date and end date are after current date
//     if (new Date(start_date) < currentDate || new Date(end_date) < currentDate) {
//       res.status(400).send({ success: false, message: 'Start date and end date must be after current date.' });
//       return;
//     }

//     // Check if end date is after start date
//     if (new Date(start_date) > new Date(end_date)) {
//       res.status(400).send({ success: false, message: 'End date must be after start date.' });
//       return;
//     }

//     // Check if leave record already exists
 
//     // Check if leave record already exists
//     const existingLeave = await new Promise((resolve, reject) => {
//       con.query('SELECT * FROM `leave` WHERE user_id = ? AND start_date = ? AND end_date = ?', [user_data.user_id, start_date, end_date],
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });
    
//     if (existingLeave.length > 0) {
//       // Leave record already exists
//       res.status(400).send({ success: false, message: 'Leave record already exists for the given dates.' });
//       return;
//     }

//     // Insert new project into database
//     const result = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO `leave` SET ?', { user_id: user_data.user_id, tittle, start_date, end_date, days },
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });

//     const userEmailResult = await new Promise((resolve, reject) => {
//       con.query('SELECT reporting.*, user.email  FROM reporting LEFT JOIN user ON reporting.user_id = user.user_id WHERE reporting.user_id ', [user_id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           if (result.length > 0) { // check if there are any rows in the result array
//             resolve(result[0].email);
//           } else {
//             reject(new Error(`No email found for user_id ${user_id}`)); // reject with an error message
//           }
//         }
//       });
//     });
//     console.log(userEmailResult);

//     // Get admin email
//     const adminEmailResult = await new Promise((resolve, reject) => {
//       con.query('SELECT email FROM user WHERE role_id = ?', [3], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result[0].email);
//         }
//       });
//     });
//     console.log(adminEmailResult);

//     // Send email to user with user_id
//     if (userEmailResult) {
//       const userMailOptions = {
//         from: process.env.EMAIL_USER,
//         to: userEmailResult,
//         subject: 'Leave Request Confirmation',
//         html: `<p>Hello,  ${user_data.name} has leave requested</p>
//              <p>Your leave request has been submitted successfully.</p>
//              <p>Leave Details:</p>
//              <ul>
//                <li>Title: ${tittle}</li>
//                <li>Start Date: ${start_date}</li>
//                <li>End Date: ${end_date}</li>
//                <li>Number of Days: ${days}</li>
//              </ul>`
//       };
//       transporter.sendMail(userMailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else
//         {
//           console.log('email sent:' + info.response);
//           res.status(200).send({ success: true, message: 'Leave insert successfully'});

//         }
//       })
//     }
//     if (adminEmailResult) {
//       const adminMailOptions = {
//         from: process.env.EMAIL_USER,
//         to: adminEmailResult,
//         subject: 'Leave Request Confirmation',
//         html: `<p>Hello, ${user_data.name} has leave requested </p>
//              <p>Your leave request has been submitted successfully.</p>
//              <p>Leave Details:</p>
//              <ul>
//                <li>Title: ${tittle}</li>
//                <li>Start Date: ${start_date}</li>
//                <li>End Date: ${end_date}</li>
//                <li>Number of Days: ${days}</li>
//              </ul>`
//       };
//       transporter.sendMail(adminMailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else
//         {
//           console.log('email sent:' + info.response);
//           res.status(200).send({ success: true, message: 'Leave insert successfully'});

//         }
//       })
//     }
//   }
//   catch(error) {
//     console.log(error);
//     res.status(400).send({ success: false, message: 'Leave insert failed', error: error.message });
//   }
// }

exports.addleave = async (req, res) => {
  try {
    const { leave_type,tittle, user_id, start_date, end_date, days,select_day } = req.body;
    const leave_id = req.params.leave_id;
    let user_data = req.user;

    // Get current date
    const currentDate = new Date();

    // Check if start date and end date are after current date
    if (new Date(start_date) < currentDate || new Date(end_date) < currentDate) {
      res.status(400).send({ success: false, message: 'Start date and end date must be after current date.' });
      return;
    }

    // Check if end date is after start date
    if (new Date(start_date) > new Date(end_date)) {
      res.status(400).send({ success: false, message: 'End date must be after start date.' });
      return;
    }

    // Check if leave record already exists

    // Check if leave record already exists
    const existingLeave = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM `leave` WHERE user_id = ? AND start_date = ? AND end_date = ?', [user_data.user_id, start_date, end_date],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });

    if (existingLeave.length > 0) {
      // Leave record already exists
      res.status(400).send({ success: false, message: 'Leave record already exists for the given dates.' });
      return;
    }

    // Insert new project into database
    const result = await new Promise((resolve, reject) => {
      con.query('INSERT INTO `leave` SET ?', { user_id: user_data.user_id,leave_type, tittle, start_date, end_date, days,select_day },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });

    const userEmailResult = await new Promise((resolve, reject) => {
      con.query('SELECT reporting.*, user.official_email  FROM reporting LEFT JOIN user ON reporting.user_id = user.user_id WHERE reporting.user_id ', [user_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) { // check if there are any rows in the result array
            resolve(result[0].official_email);
          } else {
            reject(new Error(`No email found for user_id ${user_id}`)); // reject with an error message
          }
        }
      });
    });
    console.log(userEmailResult);

    // Get admin email
    const adminEmailResult = await new Promise((resolve, reject) => {
      con.query('SELECT official_email FROM user WHERE role_id = ?', [3], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].official_email);
        }
      });
    });
    console.log(adminEmailResult);

    // Send email to user with user_id
    if (userEmailResult) {
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmailResult,
        subject: 'Leave Request Confirmation',
        html: `<p>Hello,  ${user_data.name} has leave requested</p>
             <p>Your leave request has been submitted successfully.</p>
             <p>Leave Details:</p>
             <ul>
               <li>Title: ${tittle}</li>
               <li>Start Date: ${start_date}</li>
               <li>End Date: ${end_date}</li>
               <li>Number of Days: ${days}</li>
             </ul>`
      };
      transporter.sendMail(userMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('email sent:' + info.response);
          res.status(200).send({ success: true, message: 'Leave insert successfully' });

        }
      })
    }
    if (adminEmailResult) {
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmailResult,
        subject: 'Leave Request Confirmation',
        html: `<p>Hello, ${user_data.name} has leave requested </p>
             <p>Your leave request has been submitted successfully.</p>
             <p>Leave Details:</p>
             <ul>
               <li>Title: ${tittle}</li>
               <li>Start Date: ${start_date}</li>
               <li>End Date: ${end_date}</li>
               <li>Number of Days: ${days}</li>
             </ul>`
      };
      transporter.sendMail(adminMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('email sent:' + info.response);
          res.status(200).send({ success: true, message: 'Leave insert successfully',data:user_id.user_data.user_id,leave_type, tittle, start_date, end_date, days,select_day,other:result });

        }
      })
    }
  }
  catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: 'Leave insert failed', error: error.message });
  }
}



// UPDATE LEAVE
// exports.updateleave = async (req, res) => {
//   let user_data = req.user;
//   const leave_id = req.params.leave_id;
//   const user_id = req.body.user_id;
//   const status = req.body.status;
//   try {

//     // Check if email or contact already exists
//     const result = await new Promise((resolve, reject) => {
//       con.query('UPDATE `leave` SET status = ? WHERE leave_id = ?', [status, leave_id], (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         else {
//           resolve(result);
//         }
//       }
//       );
//     });
//     // Insert notification into notifications table
//     const notificationMessage = `New leave request from User ${user_data.name}.`;

//     const leaveQueryResult = await new Promise((resolve, reject) => {
//       con.query('SELECT * FROM `leave` WHERE leave_id = ?', [leave_id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     const toId = leaveQueryResult[0].user_id;

//     const notificationResult = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO notification SET ?', { from_id: user_data.user_id, to_id: toId, type: 'leave', message: notificationMessage, is_read: 0, req_id: leave_id },
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         }
//       );
//     });
//     console.log('user_id:', user_id);
//     // Get user email
//     const emailResult = await new Promise((resolve, reject) => {
//       con.query("SELECT email FROM user WHERE user_id = ?", [toId], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result[0].email);
//         }
//       });
//     });
//     if (emailResult) {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: emailResult,
//         subject: 'Welcome to HRMS!',
//         html: `<p>Dear ${emailResult},</p>
//                <p>Your leave Status Change:${user_data.name}</p>
//                <ul>
//                <li>status: ${status}</li>
//              </ul>
//                <p>Please use the following link to login:</p>
//                <p><a href="http://localhost:1010/userlogin">http://localhost:1010/userlogin</a></p>`
//       };
//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//             }
//             else {
//                 console.log('email sent:' + info.response);
//             }
//         });
//     }
    
//     res.status(200).send({ success: true, message: 'Leave updated successfully', data: [status, leave_id], other: { leaveResult: result, notificationResult: notificationResult } });
//   }
//   catch (error) {
//     res.status(400).send({ success: false, message: 'Leave update failed', data: error.message });
//   }
// };
exports.updateleave = async (req, res) => {
  let user_data = req.user;
  const leave_id = req.params.leave_id;
  const user_id = req.body.user_id;
  const leave_type = req.body.leave_type;
  const status = req.body.status;
  try {

    // Check if email or contact already exists
    const result = await new Promise((resolve, reject) => {
      con.query('UPDATE `leave` SET leave_type = ?,status = ? WHERE leave_id = ?', [leave_type,status, leave_id], (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      }
      );
    });
    // Insert notification into notifications table
    const notificationMessage = `New leave request from User ${user_data.firstname}.`;

    const leaveQueryResult = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM `leave` WHERE leave_id = ?', [leave_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const toId = leaveQueryResult[0].user_id;

    const notificationResult = await new Promise((resolve, reject) => {
      con.query('INSERT INTO notification SET ?', { from_id: user_data.user_id, to_id: toId, type: 'leave', message: notificationMessage, is_read: 0, req_id: leave_id },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    console.log('user_id:', user_id);
    // Get user email
    const emailResult = await new Promise((resolve, reject) => {
      con.query("SELECT official_email FROM user WHERE user_id = ?", [toId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].official_email);
        }
      });
    });
    if (emailResult) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailResult,
        subject: 'Welcome to HRMS!',
        html: `<p>Dear ${emailResult},</p>
               <p>Your leave Status Change:${user_data.name}</p>
               <ul>
               <li>status: ${status}</li>
             </ul>
               <p>Please use the following link to login:</p>
               <p><a href="http://localhost:1010/userlogin">http://localhost:1010/userlogin</a></p>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
        else {
          console.log('email sent:' + info.response);
        }
      });
    }

    res.status(200).send({ success: true, message: 'Leave updated successfully', data: {leave_type,status, leave_id}, other: { leaveResult: result, notificationResult: notificationResult } });
  }
  catch (error) {
    res.status(400).send({ success: false, message: 'Leave update failed', data: error.message });
  }
};





//DELETE LEAVE
exports.deleteleave = (req,res) => {
	con.query('DELETE FROM `leave` WHERE leave_id =?',[req.params.leave_id], (err, rows, response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "LEAVE delete failed",data: response});
        }
        else
        {
			    res.status(200).send({success : true, message: "LEAVE delete successfully",data: response});
        }
    })
};




// GET APPLY-LEAVE FOR LOGIN-USER
// exports.getleavebyloginuser = (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.userId;
// //  'SELECT `leave`.*, user.name FROM `leave` LEFT JOIN user ON `leave`.user_id = user.user_id 

// con.query('SELECT `leave`.*,  DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date,DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, user.firstname FROM `leave` LEFT JOIN user ON leave.user_id = user.user_id WHERE user.user_id = ?', [userId], (err, results) => {
//   // Your code here

//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success : true, message:'Error retrieving LEAVE'});
//     }

//     console.log(query.sql);
//     const leave = results;
//     req.leave = leave;
//     console.log("userId",userId)
//     // do something with the attendance records
//     res.status(200).json({success : true, message: "LEAVE find successfully",data: leave });
//   });
// };

// exports.getleavebyloginuser = (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.userId;

//   // Get month and year from query parameters
//   const month = parseInt(req.query.month);
//   const year = parseInt(req.query.year);

//   // Modify the SQL query to include month and year in the WHERE clause
//   const query = `
//     SELECT 
//       \`leave\`.*, 
//       DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date, 
//       DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, 
//       user.firstname
//     FROM \`leave\` 
//     LEFT JOIN user ON leave.user_id = user.user_id 
//     WHERE user.user_id = ? 
//     AND YEAR(start_date) = ? 
//     AND MONTH(start_date) = ? 
//     AND leave_type = 'casual leave'
//   `;
//   con.query(query, [userId, year, month], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: 'Error retrieving LEAVE' });
//     }

//     const leave = results;
//     const queryPaidLeaveCount = `
//       SELECT COUNT(*) AS paid_leave_count 
//       FROM \`leave\` 
//       WHERE user_id = ${userId} 
//       AND leave_type = 'paid leave' 
//       AND YEAR(start_date) = ${year} 
//       AND MONTH(start_date) = ${month}
//     `;
//     con.query(queryPaidLeaveCount, (err, resultsPaidLeaveCount) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: 'Error retrieving PAID LEAVE COUNT' });
//       }

//       const paidLeaveCount = resultsPaidLeaveCount[0].paid_leave_count;
//       req.leave = leave;
//       res.status(200).json({ success: true, message: 'LEAVE find successfully', data: leave, paid_leave_count: paidLeaveCount });
//     });
//   });
// };


exports.getleavebyloginuser = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  // Get month and year from query parameters
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  // Modify the SQL query to include month and year in the WHERE clause
  const query = `
    SELECT 
      \`leave\`.*, 
      DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date, 
      DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, 
      user.firstname
    FROM \`leave\` 
    LEFT JOIN user ON leave.user_id = user.user_id 
    WHERE user.user_id = ? 
    AND YEAR(start_date) = ? 
    AND MONTH(start_date) = ? 

  `;
  con.query(query, [userId, year, month], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error retrieving LEAVE' });
    }

    const leave = results;
    const queryPaidLeaveCount = `
      SELECT COUNT(*) AS paid_leave_count 
      FROM \`leave\` 
      WHERE user_id = ${userId} 
      AND leave_type = 'paid leave' 
      AND status = 'Accept'
      AND YEAR(start_date) = ${year} 
      AND MONTH(start_date) = ${month}
    `;
    con.query(queryPaidLeaveCount, (err, resultsPaidLeaveCount) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error retrieving PAID LEAVE COUNT' });
      }
      const paidLeaveCount = resultsPaidLeaveCount[0].paid_leave_count;
      req.leave = leave;
      res.status(200).json({ success: true, message: 'LEAVE find successfully', data: leave, paid_leave_count: paidLeaveCount });
    });
  });
};







// GET LEAVE (USER_ID) WISE
// exports.getleavebyloginuser = (req, res) => {
//   // Get the authorization token from the request headers
//   const token = req.headers.authorization?.split(' ')[1];

//   // Verify the token and extract the user ID from it
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.userId;

//   const userid = req.params.user_id;

//   // Get month and year from query parameters
//   const month = parseInt(req.query.month);
//   const year = parseInt(req.query.year);


//   // Build the SQL query to retrieve leave data for the logged in user for the specified month and year
//   const query = `SELECT \`leave\`.*, 
//       DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date, 
//       DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, 
//       user.firstname
//     FROM \`leave\` 
//     LEFT JOIN user ON leave.user_id = user.user_id 
//     WHERE leave.user_id = ? 
//     AND YEAR(start_date) = ? 
//     AND MONTH(start_date) = ? 
//   `;
  
//   // Execute the SQL query
//   con.query(query, [userid, year, month], (err, results) => {
//     if (err) {
//       // Return an error if there is an error executing the query
//       console.error(err);
//       return res.status(500).json({ success: false, message: 'Error retrieving LEAVE' });
//     }

//     // Retrieve the leave data and the count of paid leaves taken by the user for the specified month and year
//     const leave = results;
//     const queryPaidLeaveCount = `
//       SELECT COUNT(*) AS paid_leave_count 
//       FROM \`leave\` 
//       WHERE user_id = ${userId} 
//       AND leave_type = 'paid leave' 
//       AND YEAR(start_date) = ${year} 
//       AND MONTH(start_date) = ${month}
//     `;
//     con.query(queryPaidLeaveCount, (err, resultsPaidLeaveCount) => {
//       if (err) {
//         // Return an error if there is an error executing the query
//         console.error(err);
//         return res.status(500).json({ success: false, message: 'Error retrieving PAID LEAVE COUNT' });
//       }

//       // Retrieve the count of paid leaves taken by the user for the specified month and year
//       const paidLeaveCount = resultsPaidLeaveCount[0].paid_leave_count;

//       // Set the leave data and the count of paid leaves as properties of the request object
//       req.leave = leave;
//       req.paidLeaveCount = paidLeaveCount;

//       // Return the leave data and the count of paid leaves as part of the response
//       res.status(200).json({ success: true, message: 'LEAVE find successfully', data: leave, paid_leave_count: paidLeaveCount });
//     });
//   });
// };


exports.getleavebyuser = (req, res) => {
  // Get the authorization token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  // Verify the token and extract the user ID from it
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const userid = req.params.user_id;

  // Get month and year from query parameters
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  // Build the SQL query to retrieve leave data for the logged in user for the specified month and year
  const query = `SELECT \`leave\`.*, 
      DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date, 
      DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, 
      user.firstname
    FROM \`leave\` 
    LEFT JOIN user ON leave.user_id = user.user_id 
    WHERE leave.user_id = ? 
    AND YEAR(start_date) = ? 
    AND MONTH(start_date) = ? `;
  
  // Execute the SQL query
  con.query(query, [userid, year, month], (err, results) => {
    if (err) {
      // Return an error if there is an error executing the query
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error retrieving LEAVE' });
    }

    // Retrieve the leave data
    const leave = results;

    // Build the SQL query to retrieve the count of paid leaves taken by the user for the specified month and year
    const queryPaidLeaveCount = `
    SELECT COUNT(*) AS paid_leave_count 
    FROM \`leave\` 
    WHERE user_id = ? 
    AND leave_type = 'paid leave' 
    AND status = 'Accept'
    AND YEAR(start_date) = ? 
    AND MONTH(start_date) = ? 
    `;

    con.query(queryPaidLeaveCount,[userid, year, month, ], (err, resultsPaidLeaveCount) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error retrieving PAID LEAVE COUNT' });
        }

        const paidLeaveCount = resultsPaidLeaveCount[0].paid_leave_count;
        req.leave = leave;
        res.status(200).json({ success: true, message: 'LEAVE find successfully', data: leave, paid_leave_count: paidLeaveCount });
    });
  });
};

