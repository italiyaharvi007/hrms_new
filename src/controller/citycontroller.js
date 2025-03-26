var con = require('../../config/hrmsconfig.js');
const PDFDocument = require('pdfkit');



// GET CITY
exports.findallcity = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
    const query = `SELECT city.*, state.state_name, created_by.firstname AS created_by
      FROM city
      LEFT JOIN state ON city.state_id = state.state_id
      LEFT JOIN user AS created_by ON city.created_by = created_by.user_id
      WHERE city.city_id LIKE '%${searchQuery}%' OR city.city_name LIKE '%${searchQuery}%'
      LIMIT ? OFFSET ?`;

  //const query = `SELECT * FROM city WHERE city_id LIKE '%${searchQuery}%' OR city_name LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM city WHERE  city_id LIKE '%${searchQuery}%' OR city_name LIKE '%${searchQuery}%'`;
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "CITY find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "CITY find failed", data: response });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({  success: true, message: "CITY find successfully",data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }



// GET ONE
// exports.findonecity = (req,res) =>{
// 	console.log(req.params)
  
// 	//con.query('SELECT * FROM city WHERE city_id = ?'
//   con.query('SELECT city.*, created_by.name AS created_by FROM city ' +
//   'LEFT JOIN user AS created_by ON city.created_by = created_by.user_id ' +
//   'WHERE  city_id = ?', { city_id: req.params.city_id }, (err, rows, fields, response) => {
//     // your code here


//         if(err)
//         {
//           //console.log(rows);
// 			    res.status(400).send({success : false, message: "CITY find failed",data: response});
//         }
//         else
//         {
// 			res.status(200).send(rows);
//         }
//     });
// };

exports.findonecity = (req, res) => {
  console.log(req.params);

  const query = `SELECT city.*, state.state_name AS state_name, created_by.firstname AS created_by 
                 FROM city 
                 LEFT JOIN user AS created_by ON city.created_by = created_by.user_id 
                 LEFT JOIN state ON city.state_id = state.state_id
                 WHERE city.city_id = ?`;

  con.query(query, [req.params.city_id], (err, rows, fields) => {
    if (err) {
      res.status(400).send({ success: false, message: "CITY find failed", data: err });
    } else {
      let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true,message:"Find One CITY Successfully",data:single});
    }
  });
};





// ADD CITY
exports.addcity = async (req, res) => {
    try {
        let user_data = req.user;
        const { city_name, state_id } = req.body;

        const citynameExists = await new Promise((resolve, reject) => {
            con.query("SELECT COUNT(*) AS count FROM city WHERE city_name = ?", [city_name], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
        // If city_name already exists, send error response
        if (citynameExists) 
        {
            res.status(400).send({success: false,message: "CITY-NAME is already being used",data: null,});
            return;
        }

        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO city SET ?", { city_name, state_id,created_by: user_data.user_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send({success: true,message: "CITY insert successfully",data: result,});
    } 
    catch (error)
    {
        res.status(400).send({success: false,message: "CITY insert failed",data: error.message,});
    }
};



// UPDATE CITY
{ // STATIC UPDATE:-
    // exports.updatecity = async (req, res) => {
//     try {
//         const { city_id } = req.params;
//         const { city_name } = req.body;
//         const { state_id } = req.body;

//         const citynameExists = await new Promise((resolve, reject) => {
//             con.query("SELECT COUNT(*) AS count FROM city WHERE city_name = ?", [city_name], (err, result) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result[0].count > 0);
//                 }
//             });
//         });
//         // city already use
//         if (citynameExists) {
//             res.status(400).send({success: false,message: "CITY is already being used",data: null,});
//             return;
//         }
//         const result = await new Promise((resolve, reject) => {
//             con.query(
//                 'UPDATE city SET city_name = ?,state_id = ? WHERE city_id = ?',
//                 [city_name, state_id, city_id],
//                 (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 },
//             );
//         });
//         res.status(200).send({success: true,message: "CITY update successfully",data: result,});
//     } 
//     catch (error) 
//     {
//         res.status(400).send({success: false,message: "CITY update failed",data: error.message,});
//     }
// };
}

exports.updatecity = async (req, res) => {
    try {
      const id = req.params.city_id;
      const cityname = req.body.city_name;
      const sid = req.body.state_id;
  
      // Check if email or contact already exists
      const existingcity = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM city WHERE (city_name = ? ) AND city_id != ?',[cityname, id],
          (err, result) => {
            if (err) 
            {
              reject(err);
            } else 
            {
              resolve(result);
            }
          }
        );
      });
  
      if (existingcity.length > 0) 
      {
        return res.status(400).send({success: false,message: 'CITY-NAME already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE city SET city_name = ?, state_id = ? WHERE city_id = ?',[ cityname, sid, id], (err, result) => {
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
      res.status(200).send({success: true,message: 'CITY updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'CITY update failed',data: error.message});
    }
  };



//DELETE CITY
exports.deletecity = (req,res) => {
	con.query('DELETE FROM city WHERE city_id =?',[req.params.city_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "CITY delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "CITY delete successfully",data: response});
        }
    })
}



// FIND BY STATE ID
exports.findbystateid = (req,res) =>{
	//console.log(req.params);

	con.query(`SELECT city.*, state.state_name AS state_name, created_by.firstname AS created_by  FROM city 
  LEFT JOIN user AS created_by ON city.created_by = created_by.user_id 
  LEFT JOIN state ON city.state_id = state.state_id
  WHERE state.state_id  =?`,[req.params.state_id], (err, rows, fields,response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "CITY Find by STATE failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "CITY Find by STATE successfully",data : rows});
        }
    });
};





// EXPORT PDF
exports.cityexportpdf = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || '';

  const query = `SELECT city.*, state.state_name, created_by.firstname AS created_by
    FROM city
    LEFT JOIN state ON city.state_id = state.state_id
    LEFT JOIN user AS created_by ON city.created_by = created_by.user_id
    WHERE city.city_id LIKE '%${searchQuery}%' OR city.city_name LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err) {
      res.status(400).send({ success: false, message: "CITY find failed", data: response });
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