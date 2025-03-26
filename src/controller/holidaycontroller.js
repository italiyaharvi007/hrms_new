const { query } = require('express');
var con = require('../../config/hrmsconfig.js');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
const moment = require('moment');



// GET HOLIDAY
   exports.findallholiday = (req, res) => {
    console.log(req.params);
    con.query(`SELECT h_id, holiday_name, holiday_type, date, status, DATE_FORMAT(date, '%Y-%m-%d') AS date, created_at,updated_at FROM holiday`, (err, rows) => {
        if (err) {
        console.error(err);
        res.status(400).send({ success: false, message: "HOLIDAY Find by USER failed", data: null });
      } else {
        res.status(200).send({ success: true, message: "HOLIDAY Find by USER successfully", data: rows });
      }
    });
  };



  //ADD HOLIDAY
exports.addholiday = async (req, res) => {
    let user_data = req.user;
    try {
      const { holiday_name, holiday_type, date,status } = req.body;
    
      const holiday = {
        holiday_name: holiday_name,
        holiday_type: holiday_type,
        date:moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        status:status,
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO holiday SET ?', holiday, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }else{
          res.status(200).json({ success: true, message: 'HOLIDAY added successfully', data: {  holiday_name, holiday_type, date,status  }, other: results });
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'HOLIDAY add failed' });
    }
  };




//UPDATE HOLIDAY
exports.updateholiday = async (req, res) => {
    try {
        const { h_id  } = req.params;
        const { holiday_name } = req.body;
        const { holiday_type } = req.body;
        const { date } = req.body;
        const { status } = req.body;
    
      con.query('UPDATE holiday SET holiday_name = ?,holiday_type = ?,date = ?,status = ? WHERE h_id  = ?', [holiday_name,holiday_type,date,status, h_id ], async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
            res.status(200).json({ success: true, message: 'HOLIDAY Update successful', data: { holiday_name,holiday_type,date,status,}, other: results });   
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'HOLIDAY Update failed' });
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







// EXPORT PDF
exports.holidayexportpdf = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const searchQuery = req.query.q || '';
  
    const query = `SELECT holiday.*, state.state_name, created_by.firstname AS created_by
      FROM city
      LEFT JOIN state ON city.state_id = state.state_id
      LEFT JOIN user AS created_by ON city.created_by = created_by.user_id
      WHERE city.city_id LIKE '%${searchQuery}%' OR city.city_name LIKE '%${searchQuery}%'
      LIMIT ? OFFSET ?`;
  
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) {
        res.status(400).send({ success: false, message: "HOLIDAY find failed", data: response });
      } else {
        const total = rows.length;
        const totalPages = Math.ceil(total / limit);
  
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
  
        if (req.query.format === 'excel') {
          // Generate Excel file and send as response
          const workbook = new excel.Workbook();
          const sheet = workbook.addWorksheet('Cities');
  
          sheet.columns = [
            { header: 'City Name', key: 'city_name', width: 30 },
            { header: 'State Name', key: 'state_name', width: 30 },
            { header: 'Created By', key: 'created_by', width: 30 }
          ];
  
          rows.forEach((row) => {
            sheet.addRow({
              city_name: row.city_name,
              state_name: row.state_name,
              created_by: row.created_by
            });
          });
  
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=cities.xlsx');
          workbook.xlsx.write(res)
            .then(() => res.end());
  
        } else {
          // Generate PDF file and send as response
          const pdfDoc = new PDFDocument();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=cities.pdf');
          pdfDoc.pipe(res);
  
          pdfDoc.fontSize(18).text('List of Cities', { align: 'center' }).moveDown();
          // pdfDoc.fontSize(12).text(`Showing page ${page} of ${totalPages}`, { align: 'right' }).moveDown();
  
          pdfDoc.font('Helvetica-Bold').fontSize(10);
          pdfDoc.text('City Name', 100, 100);
          pdfDoc.text('State Name', 200, 100);
          pdfDoc.text('Created By', 300, 100);
  
          pdfDoc.font('Helvetica').fontSize(10);
          let rowHeight = 120;
          rows.forEach((row) => {
            pdfDoc.text(row.city_name, 100, rowHeight);
            pdfDoc.text(row.state_name, 200, rowHeight);
            pdfDoc.text(row.created_by, 300, rowHeight);
            rowHeight += 20;
          });
  
          pdfDoc.end();
        }
      }
    });
  }