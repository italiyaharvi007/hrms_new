const { query } = require('express');
var con = require('../../config/hrmsconfig.js');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
const moment = require('moment');



//  FIND ALL INCOME-TAX
exports.findalltds = function (req, res) {
   
  const query = `SELECT tds.*, user.firstname AS created_by FROM tds 
LEFT JOIN user ON tds.created_by = user.user_id 
WHERE tds.id`;

con.query(query, (err, rows, response) => {
  if (err) {
    res.status(400).send({ success: false, message: "TDS find failed", data: err });
  } else {
        res.status(200).send({ success: true, message: "TDS find successfully", data: rows});
      }
  })
}




//ADD TDS
exports.addtds = async (req, res) => {
    let user_data = req.user;
    try {
      const {salary_range_start, salary_range_end, deduction_rate } = req.body;
    
      const tds = {
        salary_range_start: salary_range_start,
        salary_range_end: salary_range_end,
        deduction_rate:deduction_rate,
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO tds SET ?', tds, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }else{
          res.status(200).json({ success: true, message: 'TDS added successfully', data: {  salary_range_start, salary_range_end, deduction_rate  }, other: results });
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'TDS add failed' });
    }
  };




//UPDATE TDS
exports.updatetds = async (req, res) => {
    try {
        const { id  } = req.params;
        const { salary_range_start } = req.body;
        const { salary_range_end } = req.body;
        const { deduction_rate } = req.body;
    
      con.query('UPDATE tds SET salary_range_start = ?,salary_range_end = ?,deduction_rate = ? WHERE h_id  = ?', [salary_range_start,salary_range_end,deduction_rate, id ], async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
            res.status(200).json({ success: true, message: 'TDS Update successful', data: { holiday_name,holiday_type,date,status,}, other: results });   
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'TDS Update failed' });
    }
  };




//DELETE HOLIDAY
exports.deleteholiday = (req,res) => {
	con.query('DELETE FROM holiday WHERE h_id =?',[req.params.h_id], (err, rows, response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "HOLIDAY delete failed",data: response});
        }
        else
        {
			    res.status(200).send({success : true, message: "HOLIDAY delete successfully",data: response});
        }
    })
};






