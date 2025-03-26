var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');


// GET ATTENDANCE
exports.findallattendance = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

  const query = `SELECT attendance.*,DATE_FORMAT(intime,"%d/%m/%Y, %h:%i:%s %p") AS intime,DATE_FORMAT(outtime, "%d/%m/%Y, %h:%i:%s %p") AS outtime, user.firstname AS username, user.official_email AS user_email 
    FROM attendance 
    LEFT JOIN user ON attendance.user_id = user.user_id 
    WHERE attendance.attendance_id LIKE '%${searchQuery}%' OR user.firstname LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) as total FROM attendance WHERE attendance_id LIKE '%${searchQuery}%' OR user_id LIKE '%${searchQuery}%'`;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "ATTENDANCE find failed", data: response });
    }
    else {
      con.query(countQuery, (err, result) => {
        if (err) {
          res.status(400).send({ success: false, message: "ATTENDANCE find failed", data: response });
        }
        else {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);

          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          res.status(200).send({ status: true, message: "Find One ATTENDANCE Successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
        }
      });
    }
  });
}




// FIND ONE
exports.findoneattendance = (req, res) => {
  console.log(req.params);

  con.query(`SELECT attendance.*, user.name AS username FROM  attendance
              LEFT JOIN user ON attendance.user_id = user.user_id 
              WHERE attendance_id  = ?`, [req.params.attendance_id], (err, rows, fields, response) => {
    if (err) {
      //console.log(rows);
      res.status(400).send({ success: false, message: "ATTENDANCE find failed", data: response });
    }
    else {
      let single = (rows.length > 0) ? rows[0] : [];
      res.status(200).send({ status: true, message: "Find ATTENDANCE Successfully", data: single });
    }
  });
};




// ADD ATTENDANCE
exports.addattendance = async (req, res) => {

  const now = new Date();
  const intimeDate = dateTime.format(now, 'YYYY-MM-DD HH:mm:ss');
  console.log(intimeDate)
  const { user_id } = req.body;
  try {
    let user_data = req.user;
    // check if the user has already checked in
    const lastAttendanceResult = await new Promise((resolve, reject) => {
      con.query("SELECT * FROM attendance WHERE user_id = ? ORDER BY attendance_id DESC", [user_data.user_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (lastAttendanceResult.length > 0) {
      // user has already checked in today, so we need to insert a checkout entry
      const lastAttendance = lastAttendanceResult[0];
      if (lastAttendance.outtime) {
        // user has already checked out, so return an error
        const checkInResult = await new Promise((resolve, reject) => {
          con.query("INSERT INTO attendance SET ?", { user_id: user_data.user_id, intime: intimeDate }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
        return res.status(200).send({ success: true, message: "ATTENDANCE check-in successfully", data: checkInResult, status: true });
      }

      // user has checked in but not checked out yet, so insert a checkout entry
      const checkOutResult = await new Promise((resolve, reject) => {
        con.query('UPDATE attendance SET outtime = ? WHERE attendance_id = ? AND user_id = ?', [intimeDate, lastAttendance.attendance_id, user_data.user_id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
      });
      return res.status(200).send({ success: true, message: "ATTENDANCE check-out successfully", data: checkOutResult, status: true });
    }
    else {
      // user has not checked in yet, so we can insert a check-in entry
      const checkInResult = await new Promise((resolve, reject) => {
        con.query("INSERT INTO attendance SET ?", { user_id: user_data.user_id, intime: intimeDate }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      return res.status(200).send({ success: true, message: "ATTENDANCE check-in successfully", data: checkInResult });
    }
  }
  catch (err) {
    console.error(err);
    return res.status(400).send({ success: false, message: "Failed to insert ATTENDANCE" });
  }
};




//DELETE ATTENDANCE
exports.deleteattendance = (req, res) => {
  con.query('DELETE FROM attendance WHERE attendance_id =?', [req.params.attendance_id], (err, rows, response) => {
    if (err) {
      //console.log(rows);
      res.status(400).send({ success: false, message: "ATTENDANCE delete failed", data: response });
    }
    else {
      res.status(200).send({ success: true, message: "ATTENDANCE delete successfully", data: response });
    }
  })
}







// MONTHLY REPORT (LOGIN USER)
exports.loginusermonthlyreport = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { month, year } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const attendanceResult = await new Promise((resolve, reject) => {
      con.query("SELECT * FROM attendance WHERE user_id = ? AND YEAR(intime) = ? AND MONTH(intime) = ? ORDER BY intime DESC", [userId, year, parseInt(month)], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (attendanceResult.length === 0) {
      return res.status(400).send({ success: true, message: "User has not checked in and/or checked out yet", data: null, });
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
        const isHoliday = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM holiday WHERE date = ?", [dateKey], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.length > 0);
            }
          });
        });

        if (isHoliday) {
          attendanceData.daily_totals.push({
            date: dateKey,
            first_checkin: "--",
            last_checkout: "--",
            time_diff: "--",
            status: 'holiday',
          });
        }
        else {
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
          }
          else {
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
    return res.status(200).send({ success: true, message: "ATTENDANCE data retrieved successfully", data: attendanceData, total_working_hours: totalWorkingHoursStr });
  }
  catch (error) {
    console.error(error);
    return res.status(400).send({ success: false, message: "An error occurred while retrieving ATTENDANCE data", data: null });
  }
}






// Get ATTENDANCE BY USER_ID (MONTHLY REPORT)
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
      return res.status(400).send({ success: true, message: "User has not checked in and/or checked out yet", data: null });
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
        const isHoliday = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM holiday WHERE date = ?", [dateKey], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.length > 0);
            }
          });
        });

        if (isHoliday) {
          attendanceData.daily_totals.push({
            date: dateKey,
            first_checkin: "--",
            last_checkout: "--",
            time_diff: "--",
            status: 'holiday',
          });
        }
        else {
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
          }
          else {
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
    return res.status(200).send({ success: true, message: "ATTENDANCE data retrieved successfully", data: attendanceData, total_working_hours: totalWorkingHoursStr });
  }
  catch (error) {
    console.error(error);
    return res.status(400).send({ success: false, message: "An error occurred while retrieving ATTENDANCE data", data: null });
  }
}




// GET LOG-IN USER DAILY ATTENDANCE RECORD 
{
  // exports.dailyattendance = (req, res) => {
  //   const token = req.headers.authorization?.split(' ')[1];

  //   if (!token) 
  //   {
  //     return res.status(400).json({ error: 'No token provided' });
  //   }

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const userId = decoded.userId;
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = today.getMonth() + 1;
  //   const day = today.getDate();
  //   const intime = `${year}-${month}-${day}`;

  //   con.query(`SELECT *, DATE_FORMAT(intime, '%H:%i %p') AS intime,DATE_FORMAT(outtime, '%H:%i %p') AS outtime FROM attendance WHERE user_id = '${userId}' AND DATE(intime) = '${intime}'`, (err, results) => {
  //     if (err) 
  //     {
  //       console.error(err);
  //       return res.status(500).json({ error: 'Error retrieving attendance'});
  //     }

  //     const attendance = results;
  //     req.attendance = attendance;
  //     console.log("userId",userId);
  //     console.log("intime",intime);
  //     // do something with the attendance records
  //     res.status(200).json({ attendance });
  //   });
  // };
}

exports.dailyattendance = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  let searchDate = new Date(); // default to current date
  if (req.query.date) {
    searchDate = new Date(req.query.date);
  }

  const year = searchDate.getFullYear();
  const month = searchDate.getMonth() + 1;
  const day = searchDate.getDate();
  const intime = `${year}-${month}-${day}`;

  con.query(`SELECT *, DATE_FORMAT(intime, '%H:%i %p') AS intime, DATE_FORMAT(outtime, '%H:%i %p') AS outtime FROM attendance WHERE user_id = '${userId}' AND DATE(intime) = '${intime}'`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error retrieving ATTENDANCE" });
    }

    const attendance = results;
    req.attendance = attendance;
    console.log("userId", userId);
    console.log("intime", intime);
    // do something with the attendance records
    res.status(200).json({ success: true, message: 'ATTENDANCE find successfully', attendance });
  });
};





// ALL USER DAILY REPORT
// exports.alluserdailyattendance = (req, res) => {

//   //const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   //const userId = decoded.userId;

//   let searchDate = new Date(); // default to current date
//   if (req.query.date) {
//     searchDate = new Date(req.query.date);
//   }

//   const year = searchDate.getFullYear();
//   const month = searchDate.getMonth() + 1;
//   const day = searchDate.getDate();
//   const intime = `${year}-${month}-${day}`;

//   con.query(`SELECT *, DATE_FORMAT(intime, '%H:%i %p') AS intime, DATE_FORMAT(outtime, '%H:%i %p') AS outtime FROM attendance WHERE DATE(intime) = '${intime}'`, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error retrieving ATTENDANCE' });
//     }

//     const attendance = results;
//     //console.log("userId",userId);
//     console.log("intime",intime);
//     // do something with the attendance records
//     res.status(200).json({success: true,message: 'ATTENDANCE find successfully', attendance });
//   });
// };



exports.alluserdailyattendance = (req, res) => {

  let searchDate = new Date(); // default to current date
  if (req.query.date) {
    searchDate = new Date(req.query.date);
  }

  const year = searchDate.getFullYear();
  const month = searchDate.getMonth() + 1;
  const day = searchDate.getDate();
  const intime = `${year}-${month}-${day}`;

  con.query(`SELECT attendance.*, user.firstname, DATE_FORMAT(intime, '%H:%i %p') AS intime, DATE_FORMAT(outtime, '%H:%i %p') AS outtime FROM attendance 
             LEFT JOIN user ON attendance.user_id = user.user_id
             WHERE DATE(intime) = ?`, [intime], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving ATTENDANCE' });
    }

    const attendance = results;
    res.status(200).json({ success: true, message: 'ATTENDANCE find successfully', attendance });
  });
};




// FIND BY USER_ID
exports.findbyuser = async (req, res) => {

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
      return res.status(400).send({
        success: true,
        message: "User has not checked in and/or checked out yet",
        data: null,
      });
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
    return res.status(200).send({
      success: true,
      message: "Attendance data retrieved successfully",
      data: attendanceData,
      total_working_hours: totalWorkingHoursStr,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while retrieving attendance data",
      data: null,
    });

  }
}




// EXPORT PDF
exports.attendanceexportpdf = function (req, res) {

  const query = `SELECT DATE_FORMAT(attendance.intime, '%m/%d/%Y') AS date,attendance.attendance_id,user.username AS username,
  DATE_FORMAT(attendance.intime, '%m/%d/%Y, %h:%i:%s %p') AS intime,
  DATE_FORMAT(attendance.outtime, '%m/%d/%Y, %h:%i:%s %p') AS outtime
  FROM attendance 
  LEFT JOIN user ON attendance.user_id = user.user_id 
  WHERE attendance.attendance_id `;
  con.query(query, (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "ATTENDANCE find failed", data: response });
    } else {

      if (req.query.format === 'excel') {

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=bankdetails.xlsx');
        workbook.xlsx.write(res)
          .then(() => res.end());

      } else {
        // Generate PDF file and send as response
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=bankdetail.pdf');
        pdfDoc.pipe(res);
        let rowheight = 40;
        pdfDoc.fontSize(18).text('Attendance Report', { align: 'center' }, rowheight).moveDown();

        pdfDoc.font('Helvetica').fontSize(14);

        let currentDate = null;
        let rowHeight = 130;
        let remainingSpace = pdfDoc.page.height - rowHeight;

        rows.forEach((row) => {
          if (row.date !== currentDate) {
            // Check if there is enough space on the current page
            if (remainingSpace < 50) {
              pdfDoc.addPage();
              rowHeight = 130; // Reset row height to top of page
              remainingSpace = pdfDoc.page.height - rowHeight;
            }
            // Print date
            pdfDoc.fontSize(18).text(row.date, { align: 'center' }).moveDown();

            // Create table headers
            pdfDoc.font('Helvetica-Bold').fontSize(14);
            pdfDoc.rect(50, rowHeight, 500, 40).fill('#0072C6');
            pdfDoc.fillColor('#FFFFFF').text('ID', 60, rowHeight + 10);
            pdfDoc.text('UserName', 100, rowHeight + 10);
            pdfDoc.text('IN-Time', 200, rowHeight + 10);
            pdfDoc.text('Out-Time', 360, rowHeight + 10);

            // Reset row height
            rowHeight += 40;
            remainingSpace -= 30;
            currentDate = row.date; // Set current date to date of current row
          }

          // Check if there is enough space on the current page
          if (remainingSpace < 20) {
            pdfDoc.addPage();
            rowHeight = 120; // Reset row height to top of page
            remainingSpace = pdfDoc.page.height - rowHeight;
          }

          // Create table rows
          pdfDoc.font('Helvetica').fontSize(12);
          pdfDoc.rect(50, rowHeight, 500, 20).stroke();
          pdfDoc.fillColor('#000000').text(row.attendance_id, 60, rowHeight + 10);
          pdfDoc.text(row.username, 100, rowHeight + 10);
          pdfDoc.text(row.intime, 200, rowHeight + 10, { width: 150, align: 'left' });
          pdfDoc.text(row.outtime, 360, rowHeight + 10, { width: 150, align: 'left' });

          // Increment row height and update remaining space
          rowHeight += 20;
          remainingSpace -= 30;
        });

        pdfDoc.end();
      }
    }
  });
}