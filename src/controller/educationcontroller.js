var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const moment = require('moment');


// GET ALL EDUCATION
exports.geteducation = async (req, res) => {
    try {
      const education = await new Promise((resolve, reject) => {
        con.query(`SELECT education_info.*,DATE_FORMAT(course_start_date,"%d/%m/%Y") AS course_start_date, DATE_FORMAT(course_end_date, "%d/%m/%Y") AS course_end_date, user.firstname as username, created_by.firstname as created_by 
                    FROM education_info 
                    LEFT JOIN user ON education_info.user_id = user.user_id 
                    LEFT JOIN user created_by ON education_info.created_by = created_by.user_id`, 
                  (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      res.status(200).json({ success: true, message: 'EDUCATION find successfully', data: education });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'EDUCATION find failed' });
    }
  };
  





// GET-ONE EDUCATION
exports.getoneeducation = async (req, res) => {
    try {
      const educationId = req.params.education_id; // get the work ID from the request parameters
      const education = await new Promise((resolve, reject) => {
        con.query(
            `SELECT education_info.*,DATE_FORMAT(course_start_date,"%d/%m/%Y") AS course_start_date, DATE_FORMAT(course_end_date, "%d/%m/%Y") AS course_end_date, user.firstname as username, created_by.firstname as created_by 
            FROM education_info 
            LEFT JOIN user ON education_info.user_id = user.user_id 
            LEFT JOIN user created_by ON education_info.created_by = created_by.user_id
          WHERE education_info.education_id = ?`, // use a parameterized query to prevent SQL injection attacks
          [educationId], // pass the work ID as a query parameter
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
      });
      if (education.length === 0) { // if no work record found with the given ID
        return res.status(404).json({ success: false, message: 'WORK record not found' });
      }
      res.status(200).json({ success: true, message: 'EDUCATION record found successfully', data: education[0] });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to get EDUCATION record' });
    }
  };
  

  



// ADD EDUCATION
exports.addeducation = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
      const { user_id,qualification_type,course_name,course_type,stream,course_start_date,course_end_date,college_name,university_name} = req.body;
    
      if (moment(course_start_date).isAfter(course_end_date)) {
        return res.status(400).json({ success: false, message: 'course_start_date cannot be after end course_end_date' });
      }
      
            // Check if username, email, and contact are already in use
      const educationExists = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM education_info WHERE user_id = ? ', [user_id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (educationExists.length > 0) {
        return res.status(400).json({ success: false, message: 'USER education data is already store' });
      }
  
      const education = {
        user_id: user_id,
        qualification_type: qualification_type,
        course_name: course_name,
        course_type: course_type,
        stream: stream,
        course_start_date: moment(course_start_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        course_end_date: moment(course_end_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        college_name :college_name ,
        university_name:university_name,
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO education_info SET ?', education, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        res.status(200).json({ success: true, message: 'EDUCATION added successfully', data: {user_id,qualification_type,course_name,course_type,stream,course_start_date,course_end_date,college_name,university_name}, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'EDUCATION add failed' });
    }
  };
  




// UPDATE EDUCATION
  exports.updateeducation = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
      const { user_id,qualification_type,course_name,course_type,stream,course_start_date,course_end_date,college_name,university_name } = req.body;
      const { education_id } = req.params;
  
      const education = {
        user_id: user_id,
        qualification_type: qualification_type,
        course_name: course_name,
        course_type: course_type,
        stream: stream,
        course_start_date: moment(course_start_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        course_end_date: moment(course_end_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        college_name :college_name ,
        university_name:university_name
      };
  
      con.query('UPDATE education_info SET ? WHERE education_id = ?', [education, education_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'EDUCATION updated successfully', data: education, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'EDUCATION update failed' });
    }
  };
  


  

  
// DELETE EDUCATION
exports.deleteeducation = (req,res) => {
	con.query('DELETE FROM education_info WHERE education_id =?',[req.params.education_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "EDUCATION delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "EDUCATION delete successfully",data: response});
        }
    })
}