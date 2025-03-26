var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');
var transporter = require('../../config/nodemailer.js')



// FIND ALL REPORTING
exports.findallreporting = function (req, res) {
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

    const query = `SELECT reporting.*, user1.username AS user_name, user2.firstname AS assign_name FROM reporting 
    LEFT JOIN user user1 ON reporting.user_id = user1.user_id 
    LEFT JOIN user user2 ON reporting.assign_id = user2.user_id 
    WHERE repo_id   AND (user1.username LIKE '%${searchQuery}%' OR user2.fi LIKE '%${searchQuery}%')  `;

    const countQuery = `SELECT COUNT(*) as total FROM reporting WHERE user_id`;

    con.query(query,  (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "REPORTING find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, results) => {
          if (err) {
            res.status(400).send({ success: false, message: "REPORTING find failed", data: response });
          } else {
            res.status(200).send({ success: true, message: "REPORTING find successfully", data: rows });
          }
        });
      }
    });
}






// FIND ONE
exports.findonereporting = function (req, res) {
  const repoId = req.params.repo_id;

  const query = `SELECT reporting.*, user1.username AS user_name, user2.firstname AS assign_name FROM reporting 
  LEFT JOIN user user1 ON reporting.user_id = user1.user_id 
  LEFT JOIN user user2 ON reporting.assign_id = user2.user_id 
  WHERE reporting.repo_id = ?`;

  con.query(query, [repoId], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "REPORTING find failed", data: response });
    } else {
      res.status(200).send({ success: true, message: "REPORTING find successfully", data: rows });
    }
  });
};





//FIND ASSIGN ALL REPORTING
// exports.findallasignreporting = function (req, res) {

//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId;
//     const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

//     const query = `SELECT reporting.*, user1.username AS user_name, user2.firstname AS assign_name FROM reporting
//     LEFT JOIN user user1 ON reporting.user_id = user1.user_id 
//     LEFT JOIN user user2 ON reporting.assign_id = user2.user_id 
//     WHERE repo_id AND reporting.user_id = ${userId}
//     AND (user1.username LIKE '%${searchQuery}%' OR user2.firstname LIKE '%${searchQuery}%')`;

//     const countQuery = `SELECT COUNT(*) as total FROM reporting
//     LEFT JOIN user user1 ON reporting.user_id = user1.user_id
//     LEFT JOIN user user2 ON reporting.assign_id = user2.user_id
//     WHERE repo_id AND reporting.user_id = ${userId}
//     AND (user1.username LIKE '%${searchQuery}%' OR user2.firstname LIKE '%${searchQuery}%')`;

//     con.query(query, (err, rows) => {
//       if (err) 
//       {
//         res.status(400).send({ success: false, message: "REPORTING find failed", data: err });
//       }
//       else 
//       {
//         con.query(countQuery, (err, results) => {
//           if (err) {
//             res.status(400).send({ success: false, message: "REPORTING find failed", data: err });
//           } else {
//             const reporting_to = results;
//             req.reporting_to = reporting_to;
//             console.log("userId", userId)

//             res.status(200).send({success: false, message: "REPORTING find successfully", data: rows});
//           }
//         });
//       }
//     });
// }

exports.findallasignreporting = function (req, res) {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

    const query = `SELECT reporting.*, user1.username AS user_name, user2.firstname AS assign_name FROM reporting
    LEFT JOIN user user1 ON reporting.user_id = user1.user_id 
    LEFT JOIN user user2 ON reporting.assign_id = user2.user_id 
    WHERE repo_id AND reporting.user_id = ${userId}
    AND (user1.username LIKE '%${searchQuery}%' OR user2.firstname LIKE '%${searchQuery}%')`;

    const countQuery = `SELECT COUNT(*) as total FROM reporting
    LEFT JOIN user user1 ON reporting.user_id = user1.user_id
    LEFT JOIN user user2 ON reporting.assign_id = user2.user_id
    WHERE repo_id AND reporting.user_id = ${userId}
    AND (user1.username LIKE '%${searchQuery}%' OR user2.firstname LIKE '%${searchQuery}%')`;

    con.query(query, (err, rows) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "REPORTING find failed", data: err });
      }
      else 
      {
        con.query(countQuery, (err, results) => {
          if (err) {
            res.status(400).send({ success: false, message: "REPORTING find failed", data: err });
          } else {
            const reporting_to = results;
            req.reporting_to = reporting_to;
            console.log("userId", userId)

            res.status(200).send({success: false, message: "REPORTING find successfully", data: rows});
          }
        });
      }
    });
}





// FIND ASSIGN USER REPORTING
// exports.findoneassignuser = (req,res) =>{
//   con.query(`SELECT reporting.*, user2.firstname, email, username, password, city_id, address, birth_date, age, gender, role_id, dep_id, contact, image FROM reporting
//   INNER JOIN user user2 ON reporting.assign_id = user2.user_id
//   WHERE reporting.assign_id = ? `,
//   [req.params.assign_id], (err, rows, fields,response) => {
//       if(err)
//       {
//           //console.log(rows);
//     res.status(400).send({success : false, message: "REPORTING Find failed",data: response});
//       }
//       else
//       {
//     res.status(200).send({success : true, message: "REPORTING Find successfully",data: rows});
//       }
//   });
// };


exports.findoneassignuser = (req, res) => {
  const assignId = req.params.assign_id;

  con.query(`SELECT reporting.*, user2.firstname, middlename, lastname, official_email,personal_email,username,phoneno,alternet_phoneno,address,pincode,city_id,state_id , country_id , DATE_FORMAT(birth_date,"%d/%m/%Y") AS birth_date, age, gender,bloodgroup,marital_status, role_id, image FROM reporting
    INNER JOIN user user2 ON reporting.assign_id = user2.user_id
    WHERE reporting.assign_id = ?`, [assignId], (err, rows) => {
    if (err) {
      res.status(400).send({ success: false, message: "Failed to get reporting data", error: err });
    } else {
      res.status(200).send({ success: true, message: "Reporting data retrieved successfully", data: rows });
    }
  });
};





// ADD REPORTING 
exports.adddreporting = async (req, res) => {
  try {
      let user_data = req.user;
      const { assign_id, user_id } = req.body;

      if (assign_id === user_id) {
          res.status(400).send({success: false,message: "USER_ID and ASSIGN_ID cannot be the same",data: null,});
          return;
      }

      const reportingExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM reporting WHERE assign_id = ?", [assign_id], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result[0].count > 0);
              }
          });
      });
      if (reportingExists) 
      {
          res.status(400).send({success: false,message: "ASSIGN_ID is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO reporting SET ?", { user_id , assign_id }, (err, result) => {
              if (err) 
              {
                  reject(err);
              } else 
              {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "REPORTING insert successfully",data: result});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "REPORTING insert failed",data: error.message,});
  }
};





// UPDATE REPORTING
exports.updatereporting = async (req, res) => {
    try {
      const repo_id = req.params.repo_id;
      const user_id = req.body.user_id;
      const assign_id = req.body.assign_id;

      if (assign_id === user_id) {
        res.status(400).send({success: false,message: "USER_ID and ASSIGN_ID cannot be the same",data: null,});
        return;
    }

    const reportingExists = await new Promise((resolve, reject) => {
      con.query("SELECT COUNT(*) AS count FROM reporting WHERE assign_id = ?", [assign_id], (err, result) => {
          if (err) {
              reject(err);
          } else {
              resolve(result[0].count > 0);
          }
      });
  });
  if (reportingExists) 
  {
      res.status(400).send({success: false,message: "ASSIGN_ID is already being used",data: null,});
      return;
  }

      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE reporting SET user_id = ?, assign_id = ? WHERE repo_id = ?',[ user_id, assign_id, repo_id], (err, result) => {
            if (err) 
            {
              reject(err);
            } 
            else 
            {
              resolve(result);
            }
          }
        );
      });
      res.status(200).send({success: true,message: 'REPORTING updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'REPORTING update failed',data: error.message});
    }
  };





// DELETE REPORTING
exports.deletereporting = (req,res) => {
	con.query('DELETE FROM reporting WHERE repo_id =?',[req.params.repo_id], (err, rows, response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "REPORTING delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "REPORTING delete successfully",data: response});
        }
    })
}






// FIND LEAVE 
// exports.findbyleave = (req, res) => {
//   let user_id = req.user.user_id;
//   con.query('SELECT *, DATE_FORMAT(start_date, "%d/%m/%Y") AS start_date, DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date  FROM `leave` WHERE user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)',
//     [user_id],(err, rows, fields, response) => {
//       if (err) {
//         console.error(err); // log the error object to the console
//         res.status(400).send({success: false,message: 'Assign user LEAVE Find failed',data: response});
//       } else {
//         res.status(200).send({success: true,message: 'Assign user LEAVE Find failed',data: rows});
//       }
//     });
// };


exports.findbyleave = (req, res) => {
  let user_id = req.user.user_id;
  con.query(
    'SELECT l.*, u.firstname, DATE_FORMAT(l.start_date, "%d/%m/%Y") AS start_date, DATE_FORMAT(l.end_date, "%d/%m/%Y") AS end_date FROM `leave` l JOIN user u ON u.user_id = l.user_id WHERE l.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)',
    [user_id],
    (err, rows, fields, response) => {
      if (err) {
        console.error(err); // log the error object to the console
        res.status(400).send({success: false,message: 'Assign user leave Find failed',data: response,});
      }
       else {
        res.status(200).send({ 
          success: true, 
          message: "Leave records found successfully", 
          data: rows.map(row => ({
            leave_id: row.leave_id,
            tittle: row.tittle,
            user_id: row.user_id,
            name: row.name,
            start_date: row.start_date,
            end_date: row.end_date,
            days: row.days,
            status: row.status,
          }))
        });
      }
    }
  );
};




//Find LEAVE BY USER
exports.findbyuserid = (req, res) => {
  console.log(req.params);

  con.query('SELECT `leave`.*, DATE_FORMAT(start_date,"%d/%m/%Y") AS start_date,DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date,user.firstname FROM `leave` LEFT JOIN user ON `leave`.user_id  WHERE `leave`.user_id = ?'
    , [req.params.user_id], (err, rows, fields, response) => {
      if (err) {
        //console.log(rows);
        res.status(400).send({ success: false, message: "LEAVE find failed", data: response });
      }
      else {
        let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true,message:"Find One LEAVE Successfully",data:single});
      }
    });
};






// FIND ATTENDANCE 
exports.findbyattendance = (req, res) => {
  const { month, year } = req.query;
  let user_id = req.user.user_id;
  con.query(
    `SELECT user_id, DATE_FORMAT(intime, "%d/%m/%Y") AS attendance_date, TIME_FORMAT(MIN(intime), "%h:%i:%s %p") AS first_intime, TIME_FORMAT(MAX(outtime), "%h:%i:%s %p") AS last_outtime FROM attendance WHERE user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?) AND YEAR(intime) = ? AND MONTH(intime) = ? GROUP BY user_id, attendance_date`,
    [user_id, year, parseInt(month)],
    (err, rows, fields, response) => {
      if (err) {
        console.error(err);
        res.status(400).send({success: false, message: 'Assign user ATTENDANCE Find failed', data: response});
      } 
      else {
        res.status(200).send({success: true, message: 'Assign user ATTENDANCE Find successfully', data: rows});
      }
    }
  );
};





// FIND MONTHLY REPORT ( BY USER ID )
exports.usermonthlyreport = async (req, res) => {

  const { month, year } = req.query;
  try {

    const attendanceResult = await new Promise((resolve, reject) => {
      con.query("SELECT * FROM attendance WHERE user_id = ? AND YEAR(intime) = ? AND MONTH(intime) = ? ORDER BY intime DESC", [req.params.user_id, year, parseInt(month)], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (attendanceResult.length === 0) {
      return res.status(400).send({success: true,message: "USER has not checked in and/or checked out yet",data: null});
    }

    const lastDayOfMonth = new Date(year, parseInt(month), 0).getDate();
    const attendanceData = {
      daily_totals: [],
    };

    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dateKey = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const dayOfWeek = new Date(dateKey).getDay();
      if (dayOfWeek === 0) {
        attendanceData.daily_totals.push({
          date: dateKey,
          first_checkin: "--",
          last_checkout: "--",
          time_diff: "--",
          status: 'Sunday',
        });
      } else {
        const attendanceOnDate = attendanceResult.find(({ intime }) => {
          const intimeDate = new Date(intime);
          return intimeDate.toISOString().slice(0, 10) === dateKey;
        });

        if (attendanceOnDate) {
          const intimeDate = new Date(attendanceOnDate.intime);
          const outtimeDate = new Date(attendanceOnDate.outtime);

          const intimeStr = intimeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
          const outtimeStr = outtimeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

          const diffInMs = outtimeDate - intimeDate;
          const diffInMin = Math.floor(diffInMs / (1000 * 60));
          const diffStr = `${Math.floor(diffInMin / 60)}:${diffInMin % 60}`;

          attendanceData.daily_totals.push({
            date: dateKey,
            first_checkin: intimeStr,
            last_checkout: outtimeStr,
            time_diff: diffStr,
            status: 'present',
          });

        } else {
          attendanceData.daily_totals.push({
            date: dateKey,
            first_checkin: "--",
            last_checkout: "--",
            time_diff: "--",
            status: 'absent',
          });
        }
      }
    }

    const totalWorkingHoursInMs = attendanceResult.reduce((total, { intime, outtime }) => {
      const intimeDate = new Date(intime);
      const outtimeDate = new Date(outtime);
      const diffInMs = outtimeDate - intimeDate;
      return total + diffInMs;
    }, 0);

    const totalWorkingHours = Math.floor(totalWorkingHoursInMs / (1000 * 60 * 60));
    const totalWorkingMinutes = Math.floor((totalWorkingHoursInMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalWorkingHoursStr = `${totalWorkingHours}:${totalWorkingMinutes}`;
    return res.status(200).send({success: true,message: "ATTENDANCE data retrieved successfully",data: attendanceData,total_working_hours: totalWorkingHoursStr,});
  } 
  catch (error) {
    console.error(error);
    return res.status(400).send({success: false,message: "An error occurred while retrieving ATTENDANCE data",data: null});
  }
}





// FIND DAILY ATTENDANCE REPORT (BY USER ID)
exports.userdailyreport = (req, res) => {

  let searchDate = new Date(); // default to current date
  if (req.query.date) {
    searchDate = new Date(req.query.date);
  }
  const user_id = req.params.user_id;
  const year = searchDate.getFullYear();
  const month = searchDate.getMonth() + 1;
  const day = searchDate.getDate();
  const intime = `${year}-${month}-${day}`;

  con.query('SELECT *, DATE_FORMAT(intime, \'%H:%i %p\') AS intime, DATE_FORMAT(outtime, \'%H:%i %p\') AS outtime FROM attendance WHERE user_id = ? AND DATE(intime) = ?', [user_id, intime], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving attendance' });
    }

    // send the attendance records in the response
    res.status(200).json({ attendance: results });
  });
};




// ALL INTERN DAILY REPORT
{
// exports.allinterndailyattendance = function (req, res) {
//   let user_id = req.user.user_id;
//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }
//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   const query = `SELECT *, DATE_FORMAT(intime, '%H:%i %p') AS intime, DATE_FORMAT(outtime, '%H:%i %p') AS outtime FROM attendance WHERE user_id IN 
//   (SELECT assign_id FROM reporting WHERE reporting.assign_id = ?) AND DATE(intime) = ?`;

//   con.query(query, [user_id, intime], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Attendance find failed", data: err });
//     } else {
//       if (rows.length === 0) {
//         res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
//       } else {
//         res.status(200).send({ success: true, message: "Attendance find successfully", data: rows });
//       }
//     }
//   });
// }
}



// exports.allinterndailyattendance = function (req, res) {
//   let user_id = req.user.user_id;
//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }
//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   const query = `
//     SELECT 
//       u.user_id, 
//       u.name, 
//       MIN(a.intime) AS first_checkin, 
//       MAX(a.outtime) AS last_checkout,
//       (SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count
//     FROM 
//       user u
//       LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
//     WHERE 
//       u.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)
//     GROUP BY 
//       u.user_id
//   `;

//   con.query(query, [user_id, intime, user_id], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Attendance find failed", data: err });
//     } else {
//       const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
//       const present_employee_count = present_users.length;
//       const absent_employee_count = rows.length - present_employee_count;
//       if (rows.length === 0) {
//         res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
//       } else {
//         res.status(200).send({
//           success: true,
//           message: "Attendance find successfully",
//           data: present_users.map(row => ({
//             user_id: row.user_id,
//             name: row.name,
//             first_checkin: row.first_checkin ? row.first_checkin.toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
//             last_checkout: row.last_checkout ? row.last_checkout.toLocaleTimeString('en-US', { hour12: true }) : 'N/A'
//           })),
//           total_employee: `${rows.length}`,
//           present_employee: `${present_employee_count}`,
//           absent_employee: `${absent_employee_count}`
//         });
//       }
//     }
//   });
// }



// exports.allinterndailyattendance = function (req, res) {
//   let user_id = req.user.user_id;
//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }
//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   const query = `SELECT u.user_id, u.name, MIN(a.intime) AS first_checkin, MAX(a.outtime) AS last_checkout,(SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count
//     FROM user u LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
//     WHERE u.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)
//     GROUP BY u.user_id`;

//   con.query(query, [user_id, intime, user_id], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Attendance find failed", data: err });
//     } else {
//       const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
//       const present_employee_count = present_users.length;
//       const absent_employee_count = rows.length - present_employee_count;
//       if (rows.length === 0) {
//         res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
//       } else {
//         const present_user_working_hours = [];
//         for (let i = 0; i < present_users.length; i++) {
//           const start = present_users[i].first_checkin;
//           const end = present_users[i].last_checkout;
//           const diffInMs = end - start;
//           const diffInHours = diffInMs / (1000 * 60 * 60);
//           present_user_working_hours.push(diffInHours);
//         }
//         const total_working_hours = present_user_working_hours.reduce((a, b) => a + b, 0);
//         const average_working_hours = total_working_hours / present_employee_count;
       
//         res.status(200).send({
//           success: true,
//           message: "Attendance find successfully",
//           data: present_users.map(row => ({
//             user_id: row.user_id,
//             name: row.name,
//             first_checkin: row.first_checkin ? row.first_checkin.toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
//             last_checkout: row.last_checkout ? row.last_checkout.toLocaleTimeString('en-US', { hour12: true }) : 'N/A'
//           })),
//           total_employee: `${rows.length}`,
//           present_employee: `${present_employee_count}`,
//           absent_employee: `${absent_employee_count}`,
//           average_working_hours: `${average_working_hours.toFixed(2)} hours`
//         });
//       }
//     }
//   });
// }





// exports.allinterndailyattendance = async (req, res) => {
//   let user_id = req.user.user_id;
//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }

//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   const query = `SELECT u.user_id, u.name, MIN(a.intime) AS first_checkin, MAX(a.outtime) AS last_checkout,
//       (SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count FROM user u
//       LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
//       WHERE u.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)
//       GROUP BY  u.user_id`;

//   con.query(query, [user_id, intime, user_id], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Attendance find failed", data: err });
//     } else {
//       const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
//       const present_employee_count = present_users.length;
//       const absent_employee_count = rows.length - present_employee_count;
//       if (rows.length === 0) {
//         res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
//       } else {
//         const present_user_working_hours = [];
//         for (let i = 0; i < present_users.length; i++) {
//           const start = present_users[i].first_checkin;
//           const end = present_users[i].last_checkout;
//           const diffInMs = end - start;
//           const diffInHours = diffInMs / (1000 * 60 * 60);
//           present_user_working_hours.push(diffInHours);
//         }
//         const total_working_hours = present_user_working_hours.reduce((a, b) => a + b, 0);
//         const average_working_hours = total_working_hours / present_employee_count;
       
//         res.status(200).send({
//           success: true,
//           message: "Attendance find successfully",
//           data: present_users.map(row => ({
//             user_id: row.user_id,
//             name: row.name,
//             first_checkin: row.first_checkin ? row.first_checkin.toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
//             last_checkout: row.last_checkout ? row.last_checkout.toLocaleTimeString('en-US', { hour12: true }) : 'N/A'
//           })),
//           total_employee: `${rows.length}`,
//           present_employee: `${present_employee_count}`,
//           absent_employee: `${absent_employee_count}`,
//           average_working_hours: `${average_working_hours.toFixed(2)} hours`
//         });
//       }
//     }
//   });
// }



// exports.allinterndailyattendance = async (req, res) => {
//   con.query(query, ["manager"], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Managers find failed", data: err });
//     } else {

//   let user_id = req.user.user_id;
//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }

//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   const subquery = `SELECT assign_id FROM reporting WHERE user_id = ?`;

//   const query = `SELECT u.user_id, u.name, MIN(a.intime) AS first_checkin, MAX(a.outtime) AS last_checkout,
//       (SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count FROM user u
//       LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
//       WHERE u.user_id IN (${subquery}) AND u.role IN ('manager', 'executive_manager')
//       GROUP BY  u.user_id`;

//   con.query(query,query, [user_id, intime, user_id], (err, rows) => {
//     if (err) {
//       res.status(400).send({ success: false, message: "Attendance find failed", data: err });
//     } else {
//       const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
//       const present_employee_count = present_users.length;
//       const absent_employee_count = rows.length - present_employee_count;
//       if (rows.length === 0) {
//         res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
//       } else {
//         const present_user_working_hours = [];
//         for (let i = 0; i < present_users.length; i++) {
//           const start = present_users[i].first_checkin;
//           const end = present_users[i].last_checkout;
//           const diffInMs = end - start;
//           const diffInHours = diffInMs / (1000 * 60 * 60);
//           present_user_working_hours.push(diffInHours);
//         }
//         const total_working_hours = present_user_working_hours.reduce((a, b) => a + b, 0);
//         const average_working_hours = total_working_hours / present_employee_count;
       
//         res.status(200).send({
//           success: true,
//           message: "Attendance find successfully",
//           data: present_users.map(row => ({
//             user_id: row.user_id,
//             name: row.name,
//             first_checkin: row.first_checkin ? row.first_checkin.toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
//             last_checkout: row.last_checkout ? row.last_checkout.toLocaleTimeString('en-US', { hour12: true }) : 'N/A'
//           })),
//           total_employee: `${rows.length}`,
//           present_employee: `${present_employee_count}`,
//           absent_employee: `${absent_employee_count}`,
//           average_working_hours: `${average_working_hours.toFixed(2)} hours`
//         });
//       }
//     }
//   });
// }
//   })
// }







exports.allinterndailyattendance = async (req, res) => {
  const assignId = req.user.user_id; // defining assignId
  let user_id = req.user.user_id;
  let searchDate = new Date(); // default to current date
  let user_data = req.user;
  if (req.query.date) {
    searchDate = new Date(req.query.date);
  }
  const year = searchDate.getFullYear();
  const month = searchDate.getMonth() + 1;
  const day = searchDate.getDate();
  const intime = `${year}-${month}-${day}`;

  const query = `SELECT u.user_id, u.firstname, MIN(a.intime) AS first_checkin, MAX(a.outtime) AS last_checkout,(SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count
  FROM user u
  LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
  WHERE u.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)
  GROUP BY u.user_id`;

  con.query(query, [user_id, intime, user_id],async (err, rows) => {
    if (err) {
      res.status(400).send({ success: false, message: "Attendance find failed", data: err });
    } else {
      const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
      const present_employee_count = present_users.length;
      const absent_employee_count = rows.length - present_employee_count;
      if (rows.length === 0) {
        res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
      } else {
        const present_user_working_hours = [];
        for (let i = 0; i < present_users.length; i++) {
          const start = present_users[i].first_checkin;
          const end = present_users[i].last_checkout;
          const diffInMs = end - start;
          const diffInHours = diffInMs / (1000 * 60 * 60);
          present_user_working_hours.push(diffInHours);
        }
        const total_working_hours = present_user_working_hours.reduce((a, b) => a + b, 0);
        const average_working_hours = total_working_hours / present_employee_count;
    
        res.status(200).send({
          success: true,
          message: "Attendance find successfully",
          data: present_users.map(row => ({
            user_id: row.user_id,
            name: row.name,
            first_checkin: row.first_checkin ? row.first_checkin.toLocaleTimeString('en-US', { hour12: true }) : 'N/A',
            last_checkout: row.last_checkout ? row.last_checkout.toLocaleTimeString('en-US', { hour12: true }) : 'N/A'
          })),
          total_employee: `${rows.length}`,
          present_employee: `${present_employee_count}`,
          absent_employee: `${absent_employee_count}`,
          average_working_hours: `${average_working_hours.toFixed(2)} hours`
        });
        const emailResult = await new Promise((resolve, reject) => {
          con.query('SELECT email FROM user WHERE role_id = ?', [4], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result[0].email);
            }
          });
        });
        if (emailResult) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emailResult,
            subject: 'New ATTENDANCE REPORT',
            html: `<p>Hello MANAGER,</p>
                 <p>A new DAILY ATTENDANCE REPORT has been submitted by ${user_data.name}.</p>
                 <p>Leave Details:</p>
                 <ul>
                  <li>totle_employee: ${rows.length}</li>
                   <li>present_employee_count: ${present_employee_count}</li>
                   <li>absent_employee_count: ${absent_employee_count}</li>
                   <li>average_working_hours: ${average_working_hours}hours</li>
                 </ul>`
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
      }

    }

  });
}
