const { query } = require('express');
var con = require('../../config/hrmsconfig.js');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');


// GET BANK-DETAIL
exports.findallbankdetail = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

  const query = `SELECT bankdetail.*, user.username, city.city_name, created_by.firstname AS created_by
    FROM bankdetail 
    LEFT JOIN user ON bankdetail.user_id = user.user_id
    LEFT JOIN city ON bankdetail.city_id = city.city_id 
    LEFT JOIN user AS created_by ON bankdetail.created_by = created_by.user_id
    WHERE user.firstname LIKE '%${searchQuery}%' OR bankdetail.bank_name LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`

  //const query = `SELECT * FROM salary WHERE salary_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR salary  LIKE '%${searchQuery}%' OR bank_detail  LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM bankdetail WHERE bank_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' `;

  con.query(query, [limit, offset], (err, rows) => {
    if (err) {
      res.status(400).send({ success: false, message: "BANK_DETAIL find failed", error: err });
    }
    else {
      con.query(countQuery, (err, result) => {
        if (err) {
          res.status(400).send({ success: false, message: "BANK_DETAIL find failed", error: err });
        }
        else {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);

          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          res.status(200).send({success: true, message: "BANK_DETAIL find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
        }
      });
    }
  });
}






// GET-ONE BANK_DETAIL
exports.findonebankdetail = (req, res) => {
    console.log(req.params);
  
    con.query(`SELECT bankdetail.*, user.username, city.city_name, created_by.firstname AS created_by FROM bankdetail
    LEFT JOIN user ON bankdetail.user_id = user.user_id
    LEFT JOIN user AS created_by ON bankdetail.created_by = created_by.user_id
    LEFT JOIN city ON bankdetail.city_id = city.city_id WHERE bank_id = ?`, [req.params.bank_id], (err, rows, fields, response) => {
        if (err) {
          //console.log(rows);
          res.status(400).send({ success: false, message: "BANK_DETAIL find failed", data: response });
        }
        else {
          let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true,message:"Find One BANK_DETAIL Successfully",data:single});
        }
      });
  };



// ADD BANK_DETAIL
  exports.addbankdetail = async (req, res) => {
    try {
          let user_data = req.user;
          const { user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type } = req.body;
  
        const detailExists = await new Promise((resolve, reject) => {
            con.query('SELECT COUNT(*) AS count FROM bankdetail WHERE acc_no = ?', [acc_no], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
        // If state_name already exists, send error response
        if (detailExists) 
        {
            res.status(400).send({success: false,message: "ACCOUNT_NUMBER is already being used",data: null,});
            return;
        }
  
        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO bankdetail SET ?", {user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type, created_by: user_data.user_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send({success: true,message: "BANK_DETAIL insert successfully",data: { user_id, bank_name, acc_no, branch_name, city_id, ifsc_code, acc_type, created_by: user_data.user_id },other:result });
    } 
    catch (error)
    {
        res.status(400).send({success: false,message: "BANK_DETAIL insert failed",data: error.message,});
    }
  };




  //UPDATE BANK_DETAIL
  // exports.updatebanketail = async (req, res) => {
  //   try {
  //       const {bank_id,user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type} = req.body;
  
  //       const detailExists = await new Promise((resolve, reject) => {
  //           con.query("SELECT COUNT(*)AS count FROM bankdetail WHERE acc_no = ? AND ifsc_code = ?", [acc_no,ifsc_code], (err, result) => {
  //               if (err) 
  //               {
  //                   reject(err);
  //               } else 
  //               {
  //                   resolve(result);
  //               }
  //           });
  //       });
  //       // DETAIL already use
  //       if (detailExists.count > 0) {
  //           res.status(400).send({success: false,message: "BANK_DETAIL is already being used",data: null,});
  //           return;
  //       }
  //       const result = await new Promise((resolve, reject) => {
  //       con.query('UPDATE bankdetail SET user_id = ?,bank_name = ?,acc_no = ?,branch_name = ?,city_id = ?,ifsc_code = ?,acc_type = ? WHERE bank_id = ?',[user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type,bank_id],
  //               (err, result) => {
  //                   if (err) {
  //                       reject(err);
  //                   } else {
  //                       resolve(result);
  //                   }
  //               });
  //       });
  //       res.status(200).send({success: true,message: "BANK_DETAIL Update successfully",data: result,});
  //   } 
  //   catch (error) 
  //   {
  //       res.status(400).send({success: false,message: "BANK_DETAIL Update failed",data: error.message,});
  //   }
  // };



  exports.updatebankdetail = async (req, res) => {
    try {
      const {user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type} = req.body;
      const bank_id = req.params.bank_id;
  
      // Check if email or contact already exists
      const detailExists = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM bankdetail WHERE ( acc_no = ?  ) AND bank_id != ?',[acc_no, bank_id],
          (err, result) => {
            if (err) 
            {
              reject(err);
            } else 
            {
              resolve(result);
            }
          });
      });
  
      if (detailExists.length > 0) 
      {
        return res.status(400).send({success: false,message: 'ACCOUNT-NO already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE bankdetail SET user_id=?, bank_name=?, acc_no=?, branch_name=?, city_id=?, ifsc_code=?, acc_type=? WHERE bank_id = ?',[ user_id,bank_name,acc_no,branch_name,city_id,ifsc_code,acc_type, bank_id], (err, result) => {
            if (err) 
            {
              reject(err);
            } else 
            {
              resolve(result);
            }
          });
      });
      res.status(200).send({success: true,message: 'BANK-DETAIL updated successfully', data: { user_id, bank_name, acc_no, branch_name, city_id, ifsc_code, acc_type, bank_id },other:result });
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'BANK-DETAIL update failed',data: error.message});
    }
  };





  //DELETE BANK_DETAIL
  exports.deletebankdetail = (req,res) => {
	con.query('DELETE FROM bankdetail WHERE bank_id =?',[req.params.bank_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "BANK_DETAIL delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "BANK_DETAIL delete successfully",data: response});
        }
    })
}



// GET BANK-DETAIL BY USER_ID
exports.loginuserbankdetail = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    con.query(`SELECT bankdetail.*, user.username, city.city_name, created_by.firstname AS created_by FROM bankdetail 
    LEFT JOIN user ON bankdetail.user_id = user.user_id
    LEFT JOIN user AS created_by ON bankdetail.created_by = created_by.user_id
    LEFT JOIN city ON bankdetail.city_id = city.city_id WHERE user.user_id  = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({success : false, error: 'Error retrieving BANK-DETAIL' });
      }
  
      const bankdetail = results;
      req.bankdetail = bankdetail;
      console.log("userId",userId)
      // do something with the attendance records
      res.status(200).json({ success : true,message:'BANK-DETAIL find successfully', bankdetail });
    });
};







// EXPORT PDF
exports.bankdetailexportpdf = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

  const query = `SELECT bankdetail.*, user.username, city.city_name, created_by.firstname AS created_by
    FROM bankdetail 
    LEFT JOIN user ON bankdetail.user_id = user.user_id
    LEFT JOIN city ON bankdetail.city_id = city.city_id 
    LEFT JOIN user AS created_by ON bankdetail.created_by = created_by.user_id
    WHERE user.firstname LIKE '%${searchQuery}%' OR bankdetail.bank_name LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`

  //const query = `SELECT * FROM salary WHERE salary_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR salary  LIKE '%${searchQuery}%' OR bank_detail  LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM bankdetail WHERE bank_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' `;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "BANK-DETAIL find failed", data: response });
    } else {
      const total = rows.length;
      const totalPages = Math.ceil(total / limit);

      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

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

        pdfDoc.fontSize(18).text('List of bankdetail', { align: 'center' }).moveDown();
        // pdfDoc.fontSize(12).text(`Showing page ${page} of ${totalPages}`, { align: 'right' }).moveDown();

        pdfDoc.font('Helvetica-Bold').fontSize(10);
        // pdfDoc.text('ID', 50, 100);
        pdfDoc.text('UserName', 50, 100);
        pdfDoc.text('BankName', 130, 100);
        pdfDoc.text('ACC-type', 230, 100);
        pdfDoc.text('Acc_Number', 310, 100);
        pdfDoc.text('IFSCCode', 400, 100);
        pdfDoc.text('City', 500, 100);

       
        pdfDoc.font('Helvetica').fontSize(10);
        let rowHeight = 120;
        rows.forEach((row) => {
          // pdfDoc.text(row.bank_id, 50, rowHeight);
          pdfDoc.text(row.username, 50, rowHeight);
          pdfDoc.text(row.bank_name, 130, rowHeight);
          pdfDoc.text(row.acc_type, 230, rowHeight);
          pdfDoc.text(row.acc_no, 310, rowHeight);
          pdfDoc.text(row.ifsc_code, 400, rowHeight);
          pdfDoc.text(row.city_name, 500, rowHeight);
         
          rowHeight += 20;
        });
        pdfDoc.end();
      }
    }
  });
}





