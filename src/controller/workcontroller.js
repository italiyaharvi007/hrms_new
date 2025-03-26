var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const moment = require('moment');

// GET ALL WORK
exports.getwork = async (req, res) => {
    try {
      const allWork = await new Promise((resolve, reject) => {
        con.query(`SELECT work.*,DATE_FORMAT(joining_date,"%d/%m/%Y") AS joining_date, DATE_FORMAT(resignation_date, "%d/%m/%Y") AS resignation_date, DATE_FORMAT(last_working_day, "%d/%m/%Y") AS last_working_day, user.firstname as username, role.role_name, department.dep_name, sub_department.subdepartment_name, created_by_user.firstname as created_by_user_name 
                    FROM work 
                    LEFT JOIN user  ON work.user_id = user.user_id 
                    LEFT JOIN role  ON work.role_id = role.role_id 
                    LEFT JOIN department ON work.dep_id = department.dep_id 
                    LEFT JOIN sub_department ON work.sub_dep_id = sub_department.sub_dep_id 
                    LEFT JOIN user created_by_user ON work.created_by = created_by_user.user_id`, 
                  (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      res.status(200).json({ success: true, message: 'WORK find successfully', data: allWork });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'WORK find failed' });
    }
  };
  



  // GET-ONE WORK
exports.getonework = async (req, res) => {
    try {
      const workId = req.params.work_id; // get the work ID from the request parameters
      const work = await new Promise((resolve, reject) => {
        con.query(
          `SELECT work.*,DATE_FORMAT(joining_date,"%d/%m/%Y") AS joining_date, DATE_FORMAT(resignation_date, "%d/%m/%Y") AS resignation_date, DATE_FORMAT(last_working_day, "%d/%m/%Y") AS last_working_day, user.firstname as username, role.role_name, department.dep_name, sub_department.subdepartment_name, created_by_user.firstname as created_by_user_name 
          FROM work 
          LEFT JOIN user  ON work.user_id = user.user_id 
          LEFT JOIN role  ON work.role_id = role.role_id 
          LEFT JOIN department ON work.dep_id = department.dep_id 
          LEFT JOIN sub_department ON work.sub_dep_id = sub_department.sub_dep_id 
          LEFT JOIN user created_by_user ON work.created_by = created_by_user.user_id 
          WHERE work.work_id = ?`, // use a parameterized query to prevent SQL injection attacks
          [workId], // pass the work ID as a query parameter
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      if (work.length === 0) { // if no work record found with the given ID
        return res.status(404).json({ success: false, message: 'WORK record not found' });
      }
      res.status(200).json({ success: true, message: 'WORK record found successfully', data: work[0] });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to get WORK record' });
    }
  };
  

  


// ADD WORK
exports.addwork = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
      const { user_id , joining_date, probation_period, employee_type,work_location,work_experience,employee_status,role_id,job_tittle,dep_id,sub_dep_id,from, to, resignation_date, resignation_status, notice_period, last_working_day} = req.body;
    
      // Check if username, email, and contact are already in use
      const checkUser = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM work WHERE user_id = ? ', [user_id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (checkUser.length > 0) {
        return res.status(400).json({ success: false, message: 'USER work data is already store' });
      }
  
      const work = {
        user_id: user_id,
        joining_date: moment(joining_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        probation_period: probation_period,
        employee_type: employee_type,
        work_location: work_location,
        work_experience: work_experience,
        employee_status: employee_status,
        role_id :role_id ,
        job_tittle:job_tittle,
        dep_id : dep_id ,
        sub_dep_id : sub_dep_id ,
        from: from,
        to:to,
        resignation_date:moment(resignation_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        resignation_status: resignation_status,
        notice_period: notice_period,
        last_working_day: last_working_day,
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO work SET ?', work, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        res.status(200).json({ success: true, message: 'WORK added successfully', data: {user_id , joining_date, probation_period, employee_type,work_location,work_experience,employee_status,role_id,job_tittle,dep_id,sub_dep_id,from, to, resignation_date, resignation_status, notice_period, last_working_day}, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'WORK add failed' });
    }
  };
  



// UPDATE BASIC-INFO
exports.updatebasicinfo = async (req, res) => {
    let user_data = req.user;
    try {
      const { user_id ,joining_date, probation_period, employee_type, work_location, work_experience, employee_status} = req.body;
      const { work_id } = req.params;
  
      const work = {
        user_id : user_id ,
        joining_date: moment(joining_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        probation_period: probation_period,
        employee_type: employee_type,
        work_location: work_location,
        work_experience: work_experience,
        employee_status: employee_status,
      };
  
      con.query('UPDATE work SET ? WHERE work_id = ?', [work, work_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'WORK updated successfully', data: work, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'WORK update failed' });
    }
  };
  


// UPDATE WORK-INFO
exports.updatworkinfo = async (req, res) => {
    try {
      const { role_id, job_tittle, dep_id, sub_dep_id, } = req.body;
      const { work_id } = req.params;
  
      const work = {
        role_id: role_id,
        job_tittle: job_tittle,
        dep_id: dep_id,
        sub_dep_id: sub_dep_id,
  
      };
  
      con.query('UPDATE work SET ? WHERE work_id = ?', [work, work_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'WORK updated successfully', data: work, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'WORK update failed' });
    }
  };
  


// UPDATE WORK-HISTORY
  exports.updatworkhistory = async (req, res) => {
    try {
      const { dep_id, sub_dep_id, from, to } = req.body;
      const { work_id } = req.params;
  
      const work = {
        dep_id: dep_id,
        sub_dep_id: sub_dep_id,
        from: from,
        to: to
      };
  
      con.query('UPDATE work SET ? WHERE work_id = ?', [work, work_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'WORK updated successfully', data: work, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'WORK update failed' });
    }
  };
  


// UPDATE WORK-RESIGNATION
exports.updateresignation = async (req, res) => {
  try {
    const { resignation_date, resignation_status, notice_period, last_working_day} = req.body;
    const { work_id } = req.params;

    const work = {
        resignation_date: moment(resignation_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        resignation_status: resignation_status,
        notice_period: notice_period,
        last_working_day: last_working_day,
    };

    con.query('UPDATE work SET ? WHERE work_id = ?', [work, work_id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: 'Internal server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(400).json({ success: false, message: 'No matching record found' });
      }
      res.status(200).json({ success: true, message: 'WORK updated successfully', data: work, other: results });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'WORK update failed' });
  }
};



// TERMINATE-USER
exports.terminateuser = async (req, res) => {
  let user_data = req.user;
  try {
    const { terminate} = req.body;
    const { work_id } = req.params;

    const work = {
      terminate: terminate 
    };

    con.query('UPDATE work SET ? WHERE work_id = ?', [work, work_id], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: 'Internal server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(400).json({ success: false, message: 'No matching record found' });
      }
      const terminaterequest = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM work WHERE work_id = ?', [work_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const toId = terminaterequest[0].user_id;
      const notificationMessage = `You have been terminated ${user_data.firstname}.`;
      const notification = {
        from_id: user_data.user_id,
        to_id: toId,
        type: 'Terminate',
        message: notificationMessage,
        is_read: 0,
        req_id: work_id
      };

      con.query('INSERT INTO notification SET ?', notification, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ success: false, message: 'Failed to insert notification' });
        }
        res.status(200).json({ success: true, message: 'WORK updated successfully', data: work, other: result });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'WORK update failed' });
  }
};






// DELETE WORK
exports.deletework = (req,res) => {
	con.query('DELETE FROM work WHERE work_id =?',[req.params.work_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "WORK delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "WORK delete successfully",data: response});
        }
    })
}