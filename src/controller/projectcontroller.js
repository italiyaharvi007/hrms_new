var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
var transporter = require('../../config/nodemailer.js');
const moment = require('moment'); 


// GET PROJECT
// exports.findallproject = function (req, res) {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
  
//     const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

//     const query = `SELECT project.*, DATE_FORMAT(project.start_date,'%d/%m/%Y') AS start_date, DATE_FORMAT(project.end_date,'%d/%m/%Y') AS end_date, user.name, technology.tec_name, user.name AS created_by 
//     FROM project 
//     LEFT JOIN user ON project.user_id = user.user_id 
//     LEFT JOIN technology ON project.tec_id = technology.tec_id 
//     LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
//     WHERE project.pro_id LIKE '%${searchQuery}%' OR user.name LIKE '%${searchQuery}%' OR project.pro_name LIKE '%${searchQuery}%'
//     LIMIT ? OFFSET ?`;

  
//     //const query = `SELECT * FROM project WHERE pro_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%'OR pro_name  LIKE '%${searchQuery}%' OR status  LIKE '%${searchQuery}%'  OR tec_id  LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
//     const countQuery = `SELECT COUNT(*) as total FROM project WHERE pro_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR pro_name  LIKE '%${searchQuery}%' OR status  LIKE '%${searchQuery}%' OR tec_id  LIKE '%${searchQuery}%'`;
  
//     con.query(query, [limit, offset], (err, rows, response) => {
//       if (err) 
//       {
//         res.status(400).send({ success: false, message: "PROJECT find failed", data: response });
//       }
//       else 
//       {
//         con.query(countQuery, (err, result) => {
//           if (err) 
//           {
//             res.status(400).send({ success: false, message: "PROJECT find failed", data: response });
//           } 
//           else 
//           {
//             const total = result[0].total;
//             const totalPages = Math.ceil(total / limit);
  
//             const prevPage = page > 1 ? page - 1 : null;
//             const nextPage = page < totalPages ? page + 1 : null;
  
//             res.status(200).send({ success: true, message: "PROJECT find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
//           }
//         });
//       }
//     });
//   }

exports.findallproject = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

  const query = `SELECT project.*, DATE_FORMAT(project.start_date,'%Y-%m-%d') AS start_date, DATE_FORMAT(project.end_date,'%Y-%m-%d') AS end_date, DATE_FORMAT(project.project_end_date,'%Y-%m-%d') AS project_end_date, user.firstname, technology.tec_name, created_by.firstname AS created_by
  FROM project 
  LEFT JOIN user ON project.user_id = user.user_id 
  LEFT JOIN technology ON project.tec_id = technology.tec_id 
  LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
  WHERE project.pro_id LIKE '%${searchQuery}%' OR user.firstname LIKE '%${searchQuery}%' OR project.pro_name LIKE '%${searchQuery}%'
  LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) as total FROM project WHERE pro_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR pro_name  LIKE '%${searchQuery}%' OR status  LIKE '%${searchQuery}%' OR tec_id  LIKE '%${searchQuery}%'`;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "Project find failed", data: response });
    }
    else {
      con.query(countQuery, (err, result) => {
        if (err) {
          res.status(400).send({ success: false, message: "Project find failed", data: response });
        }
        else {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);

          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          const projects = rows.map(project => {
            const projectEndDate = moment(project.project_end_date, 'YYYY-MM-DD');
            const endDate = moment(project.end_date, 'YYYY-MM-DD');
            const diffDays = parseInt((projectEndDate - endDate) / (1000 * 60 * 60 * 24));

            return {
              ...project,
              start_date: moment(project.start_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
              end_date: moment(project.end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
              project_end_date: moment(project.project_end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
              daysDifference: diffDays >= 0 ? `${diffDays} days late` : `${-1 * diffDays} days early`,
            };
          });

          res.status(200).send({ status: true, message: "Project Found Successfully", data: projects, pagination: { total, totalPages, page, prevPage, nextPage } });
        }
      });
    }
  });
}






// FIND ONE
// exports.findoneproject = (req,res) =>{
// 	console.log(req.params);

// 	con.query(`SELECT project.*, DATE_FORMAT(project.start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(project.end_date,"%d/%m/%Y") AS end_date, technology.tec_name, user.name AS created_by 
//    FROM project
//    LEFT JOIN user ON project.user_id = user.user_id 
//    LEFT JOIN technology ON project.tec_id = technology.tec_id 
//    LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
//   WHERE pro_id = ?`, [req.params.pro_id], (err, rows, fields,response) => {
//         if(err)
//         {
//           //console.log(rows);
// 			    res.status(400).send({success : false, message: "PROJECT find failed",data: response});
//         }
//         else
//         {
//           let single = (rows.length > 0) ? rows[0] : [];
//           res.status(200).send({status:true, message:"Find One PROJECT Successfully", data:single});
//         }
//     });
// };

exports.findoneproject = (req, res) => {
  console.log(req.params);

  con.query(`SELECT project.*, DATE_FORMAT(project.start_date,'%Y-%m-%d') AS start_date, DATE_FORMAT(project.end_date,'%Y-%m-%d') AS end_date, DATE_FORMAT(project.project_end_date,'%Y-%m-%d') AS project_end_date, user.username, technology.tec_name, created_by.firstname AS created_by
   FROM project
   LEFT JOIN user ON project.user_id = user.user_id 
   LEFT JOIN technology ON project.tec_id = technology.tec_id 
   LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
  WHERE pro_id = ?`, [req.params.pro_id], (err, rows, fields, response) => {
    if (err) {
      //console.log(rows);
      res.status(400).send({ success: false, message: "PROJECT find failed", data: response });
    }
    else {
      const projects = rows.map(project => {
        const projectEndDate = moment(project.project_end_date, 'YYYY-MM-DD');
        const endDate = moment(project.end_date, 'YYYY-MM-DD');
        const diffDays = parseInt((projectEndDate - endDate) / (1000 * 60 * 60 * 24));

        return {
          ...project,
          start_date: moment(project.start_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
          end_date: moment(project.end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
          project_end_date: moment(project.project_end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
          daysDifference: diffDays >= 0 ? `${diffDays} days late` : `${-1 * diffDays} days early`,
        };
      });
      let single = (rows.length > 0) ? rows[0] : [];
      res.status(200).send({ status: true, message: "Find One PROJECT Successfully", data: projects });
    }
  });
};



// ADD PROJECT
// exports.addproject = async (req, res) => {
//   try {
//     const { user_id, pro_name, start_date, end_date, status, description, tec_id } = req.body;
//     let user_data = req.user;

//     // Check if start_date and end_date are in the format of YYYY-MM-DD
//     const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
//     if (!isValidDate(start_date) || !isValidDate(end_date)) {
//       res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
//       return;
//     }

//     // Convert start_date and end_date to Date objects
//     const startDateObj = new Date(start_date);
//     const endDateObj = new Date(end_date);

//     // Check if start_date is before end_date
//     if (startDateObj >= endDateObj) {
//       res.status(400).send({ success: false, message: "Start date must be before end date.", data: null });
//       return;
//     }

//     const projectnameExists = await new Promise((resolve, reject) => {
//       con.query("SELECT COUNT(*) AS count FROM project WHERE pro_name = ?", [pro_name], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result[0].count > 0);
//         }
//       });
//     });

//     // If project name already exists, send error response
//     if (projectnameExists) {
//       res.status(400).send({ success: false, message: "PROJECT-NAME is already being used", data: null });
//       return;
//     }

//     const result = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO project SET ?', {
//         user_id,
//         pro_name,
//         start_date: startDateObj,
//         end_date: endDateObj,
//         status,
//         description,
//         tec_id,
//         created_by: user_data.user_id
//       },
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         }
//       );
//     });
//     res.status(200).send({ success: true, message: 'PROJECT inserted successfully', data: result });
//   } catch (error) {
//     res.status(500).send({ success: false, message: 'PROJECT insert failed', error: error.message });
//   }
// };


// exports.addproject = async (req, res) => {
//   try {
//     const { user_id, pro_name, start_date, end_date, status, description, tec_id } = req.body;
//     let user_data = req.user;
//     //adminId = '1';
    
//     // Check if start_date and end_date are in the format of YYYY-MM-DD
//     const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
//     if (!isValidDate(start_date) || !isValidDate(end_date)) {
//       res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
//       return;
//     }

//     // Convert start_date and end_date to Date objects
//     const startDateObj = new Date(start_date);
//     const endDateObj = new Date(end_date);
//     const currentDate = new Date();

//     // Check if start_date is before end_date
//     if (startDateObj >= endDateObj) {
//       res.status(400).send({ success: false, message: "START-DATE must be before END-DATE.", data: null });
//       return;
//     }
//     if ( new Date(end_date) <= currentDate) {
//       res.status(400).send({ success: false, message: 'END-DATE must be after CURRENT-DATE.' });
//       return;
//     }

//     const projectnameExists = await new Promise((resolve, reject) => {
//       con.query("SELECT COUNT(*) AS count FROM project WHERE pro_name = ?", [pro_name], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result[0].count > 0);
//         }
//       });
//     });

//     // If project name already exists, send error response
//     if (projectnameExists) {
//       res.status(400).send({ success: false, message: "PROJECT-NAME is already being used", data: null });
//       return;
//     }

//     const result = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO project SET ?', {user_id,pro_name,start_date: startDateObj,end_date: endDateObj,status,description,tec_id,created_by: user_data.user_id},
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });
//     const notificationMessage = `New project request from User ${user_data.name}.`;

//     const notificationResult = await new Promise((resolve, reject) => {
//       con.query('INSERT INTO notification SET ?', { from_id:user_data.user_id  , to_id: user_id , type: 'project', message: notificationMessage, is_read: 0, req_id: result.insertId},
//         (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//     });
//     res.status(200).send({ success: true, message: 'PROJECT inserted successfully', data: {user_id,pro_name,start_date: startDateObj,end_date: endDateObj,status,description,tec_id,created_by: user_data.user_id},other: { leaveResult: result, notificationResult: notificationResult } });
//   } catch (error) {
//     res.status(400).send({ success: false, message: 'PROJECT insert failed', error: error.message });
//   }
// };


exports.addproject = async (req, res) => {
  try {
    const { user_id, pro_name, start_date, end_date, status, description, tec_id } = req.body;
    let user_data = req.user;

    // Check if start_date and end_date are in the format of YYYY-MM-DD
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
      return;
    }

    // Convert start_date and end_date to Date objects
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const currentDate = new Date();

    // Check if start_date is before end_date
    if (startDateObj >= endDateObj) {
      res.status(400).send({ success: false, message: "Start date must be before end date.", data: null });
      return;
    }
    // if (new Date(end_date) <= currentDate) {
    //   res.status(400).send({ success: false, message: 'end date must be after current date.' });
    //   return;
    // }

    // Retrieve user email from database
    const emailResult = await new Promise((resolve, reject) => {
      con.query("SELECT email FROM user WHERE user_id = ?", [user_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].email);
        }
      });
    });

    const checkProject = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM project WHERE pro_name = ?', [pro_name], (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
      });
  });

  if (checkProject.length > 0) {
      return res.status(400).json({ success: false, message: 'Project-Name already in use' });
  }


    const result = await new Promise((resolve, reject) => {
      con.query('INSERT INTO project SET ?', { user_id, pro_name, start_date: startDateObj, end_date: endDateObj, status, description, tec_id, created_by: user_data.user_id },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });

    const notificationMessage = `New Project request from User ${user_data.name}.`;

    const notificationResult = await new Promise((resolve, reject) => {
      con.query('INSERT INTO notification SET ?', { from_id: user_data.user_id, to_id: user_id, type: 'project', message: notificationMessage, is_read: 0, req_id: result.insertId },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });

    if (emailResult) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailResult,
        subject: 'Welcome to HRMS!',
        html: `<p>Dear ${emailResult},</p>
               <p>Your account has been created on HRMS. Here are your login credentials:</p>
               <ul>
                  <li>ProjectName: ${pro_name}</li>
                  <li>start_date: ${start_date}</li>
                  <li>end_date: ${end_date}</li>
               </ul>
               <p>Please use the following link to login:</p>
               <p><a href="http://localhost:1010/userlogin">http://localhost:1010/userlogin</a></p>`
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
            res.status(200).send({ success: true, message: 'PROJECT inserted successfully and email sent', data: { user_id, pro_name, start_date: startDateObj, end_date: endDateObj, status, description, tec_id, created_by: user_data.user_id }, other: { leaveResult: result, notificationResult: notificationResult }, emailSent: true });
          }
        })
    }
   res.status(200).send({ success: true, message: 'PROJECT inserted successfully', data: { user_id, pro_name, start_date: startDateObj, end_date: endDateObj, status, description, tec_id, created_by: user_data.user_id }, other: { leaveResult: result, notificationResult: notificationResult } });

  } catch (error) {
    res.status(400).send({ success: false, message: 'PROJECT insert failed', error: error.message });

  }
};





// UPDATE PROJECT
{
// exports.updateproject = async (req, res) => {
//   console.log(req.body);
//   const pro_id = req.params.pro_id;
//   const user_id = req.body.user_id;
//   const pro_name = req.body.pro_name;
//   const start_date = req.body.start_date;
//   const end_date = req.body.end_date;
//   const status = req.body.status;
//   const description = req.body.description;
//   const tec_id = req.body.tec_id;

//   const projectnameExists = await new Promise((resolve, reject) => {
//   con.query('SELECT * FROM project WHERE pro_name = ? AND pro_id != ?', [pro_name,pro_id], (err, result) => {
//         if (err) 
//         {
//           reject(err);
//         } else 
//         {
//           resolve(result);
//         }
//       });
//     });

//     // Country already use
//     if (projectnameExists.length > 0) 
//     {
//       //res.status(400).send({success: false,message: "Projectname is already being used",data: null,});
//       return res.status(400).send({success: false,message: "Projectname is already being used"});
      
//     }

//     try 
//     {
//       const result = await new Promise((resolve, reject) => {
//           con.query('UPDATE project SET user_id = ?,pro_name = ?,start_date = ?,end_date = ? ,status = ?,description = ?, tec_id = ? WHERE pro_id = ? ', [user_id, pro_name, start_date, end_date, status, description, tec_id, pro_id], (err, result) => {
//               if (err) {
//                   reject(err);
//               } else {
//                   resolve(result);
//               }
//           });
//       });

//       res.status(200).send({ success: true, message: "project Update successfully", data: result });

//   } catch (err) {
//       res.status(404).send({ success: false, message: "project Update failed", data: err });
//   }
// }
}

exports.updateproject = async (req, res) => {
  try {
    const { start_date, status, project_end_date } = req.body;
    const pro_id = req.params.pro_id;

    const isValidDate = (date) => moment(date, 'YYYY-MM-DD', true).isValid();
    if (!isValidDate(project_end_date)) {
      res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
      return;
    }

    const startDateObj = moment(start_date, 'YYYY-MM-DD');
    const projectEndDateObj = moment(project_end_date, 'YYYY-MM-DD');
    if (startDateObj.isSameOrAfter(projectEndDateObj)) {
      return res.status(400).send({ success: false, message: "Start date must be before project end date" });
    }

    const result = await new Promise((resolve, reject) => {
      con.query('UPDATE project SET status = ?,start_date = ?, project_end_date = ? WHERE pro_id = ?', [status, startDateObj.format('YYYY-MM-DD'), projectEndDateObj.format('YYYY-MM-DD'), pro_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).send({ success: true, message: "PROJECT updated successfully", data: { status,start_date, project_end_date }, other: result });
  } catch (error) {
    res.status(400).send({ success: false, message: "PROJECT update failed", data: error.message });
  }
};







//DELETE PROJECT
exports.deleteproject = (req,res) => {
	con.query('DELETE FROM project WHERE pro_id =?',[req.params.pro_id], (err, rows, response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "PROJECT delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "PROJECT delete successfully",data: response});
        }
    })
}






// FIND BY USER ID
exports.findbyuser = (req,res) =>{
	console.log(req.params);
  
	con.query(`SELECT project.*, DATE_FORMAT(project.start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(project.end_date,"%d/%m/%Y") AS end_date, technology.tec_name, user.firstname AS created_by 
  FROM project
  LEFT JOIN user ON project.user_id = user.user_id 
  LEFT JOIN technology ON project.tec_id = technology.tec_id 
  LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
  WHERE user.user_id = ?`,[req.params.user_id ], (err, rows, fields,response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "PROJECT Find failed",data: response});
        }
        else
        {
			    res.status(200).send({success:true, message:"PROJECT find by USER successfully", data:rows});
        }
    });
};






// FIND BY TECHNOLOGY ID
exports.findbytechnology = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT project.*, DATE_FORMAT(project.start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(project.end_date,"%d/%m/%Y") AS end_date, technology.tec_name, user.firstname AS created_by 
  FROM project
  LEFT JOIN user ON project.user_id = user.user_id 
  LEFT JOIN technology ON project.tec_id = technology.tec_id 
  LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
  WHERE technology.tec_id = ?`,[req.params.tec_id], (err, rows,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "PROJECT Find failed",data: response});
        }
        else
        {
			res.status(200).send({success:true, message:"PROJECT find by TECHNOLOGY successfully", data:rows});
        }
    });
};







// GET ( LOG-IN USER VIEW PROJECT )
// exports.loginuserproject = (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.userId;                                                                                                                                                                                                     

//   con.query(`SELECT project.*, DATE_FORMAT(project.start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(project.end_date,"%d/%m/%Y") AS end_date ,user.name ,technology.tec_name, created_by.name AS created_by FROM project 
//   LEFT JOIN user ON project.user_id = user.user_id
//   LEFT JOIN technology ON project.tec_id = technology.tec_id 
//   LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
//   WHERE user.user_id  = ${userId}`, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(400).json({success:false , message:'Error retrieving PROJECT' });
//     }

//     const project = results;
//     req.project = project;
//     console.log("userId",userId)
//     // do something with the attendance records
//     res.status(200).json({success:true, message:"PROJECT find by LIGIN-USER successfully", data:project });
//   });
// };


exports.loginuserproject = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  con.query(`SELECT project.*, DATE_FORMAT(project.start_date,'%Y-%m-%d') AS start_date, DATE_FORMAT(project.end_date,'%Y-%m-%d') AS end_date, DATE_FORMAT(project.project_end_date,'%Y-%m-%d') AS project_end_date, user.firstname, technology.tec_name, created_by.firstname AS created_by
  FROM project 
  LEFT JOIN user ON project.user_id = user.user_id 
  LEFT JOIN technology ON project.tec_id = technology.tec_id 
  LEFT JOIN user AS created_by ON project.created_by = created_by.user_id
  WHERE user.user_id  = ${userId}`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Error retrieving Project' });
    }

    const project = results;
    req.project = project;
    console.log("userId", userId)

    const projects = results.map(project => {
      const projectEndDate = moment(project.project_end_date, 'YYYY-MM-DD');
      const endDate = moment(project.end_date, 'YYYY-MM-DD');
      const diffDays = parseInt((projectEndDate - endDate) / (1000 * 60 * 60 * 24));

      return {
        ...project,
        start_date: moment(project.start_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
        end_date: moment(project.end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
        project_end_date: moment(project.project_end_date, 'YYYY-MM-DD').format("DD/MM/YYYY"),
        daysDifference: diffDays >= 0 ? `${diffDays} days late` : `${-1 * diffDays} days early`,
      };
    });
    // do something with the attendance records
    res.status(200).json({ status: true, message: "Login User Project Find Successfully", data: projects });
  });
};