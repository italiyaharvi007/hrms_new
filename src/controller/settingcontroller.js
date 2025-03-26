var con = require('../../config/hrmsconfig.js');

// GET SETTING
// exports.findallsetting = function (req, res) {
   
//     const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

//     const query = `SELECT setting.*, user.firstname AS created_by FROM setting 
//     LEFT JOIN user ON setting.created_by = user.user_id 
//     WHERE setting.type`;

//     const countQuery = `SELECT COUNT(*) as total FROM setting WHERE type LIKE '%${searchQuery}%'`;

//     con.query(query, (err, rows, response) => {
//       if (err) 
//       {
//         res.status(400).send({ success: false, message: "SETTING find failed", data: err });
//       }
//       else 
//       {
//         con.query(countQuery, (err, result) => {
//           if (err) {
//             res.status(400).send({ success: false, message: "SETTING find failed", data: response });
//           } else {
//             res.status(200).send({ success: true, message: "SETTING find successfully",data: rows});
//           }
//         });
//       }
//     });
//   }

exports.findallsetting = function (req, res) {
   
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
    const page = req.query.page || 1; // get the page number parameter, set to 1 if not provided
    const limit = 10; // set the number of items per page
  
    const offset = (page - 1) * limit; // calculate the offset based on the page number and limit
  
    const query = `SELECT setting.*, user.firstname AS created_by FROM setting 
    LEFT JOIN user ON setting.created_by = user.user_id 
    WHERE setting.type LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  
    const countQuery = `SELECT COUNT(*) as total FROM setting WHERE type LIKE '%${searchQuery}%'`;
  
    con.query(query, (err, rows, response) => {
      if (err) {
        res.status(400).send({ success: false, message: "SETTING find failed", data: err });
      } else {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "SETTING find failed", data: response });
          } else {
            const totalCount = result[0].total;
            const totalPages = Math.ceil(totalCount / limit); // calculate the total number of pages
  
            res.status(200).send({ success: true, message: "SETTING find successfully", data: rows, page: page, totalPages: totalPages });
          }
        });
      }
    });
  }
  




// ADD SETTING
exports.addsetting = async (req, res) => {
  try {
      let user_data = req.user;
      const { type } = req.body;
      const { rate } = req.body;

      const typeExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM setting WHERE type = ?", [type], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result[0].count > 0);
              }
          });
      });
      // If state_name already exists, send error response
      if (typeExists) 
      {
          res.status(400).send({success: false,message: "TYPE is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO setting SET ?", {type, rate,  created_by: user_data.user_id }, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "TYPE & RATE Insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "TYPE & RATE Insert failed",data: error.message,});
  }
};




// UPDATE SETTING
exports.updatesetting = async (req, res) => {
  try {
    const id = req.params.id ;
    const type = req.body.type;
    const rate = req.body.rate;

    // Check if email or contact already exists
    const existingtype = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM setting WHERE (type = ? ) AND rate = ?',[type, rate],
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

    if (existingtype.length > 0) 
    {
      return res.status(400).send({success: false,message: 'TYPE already exists'});
    }

    const result = await new Promise((resolve, reject) => {
      con.query('UPDATE setting SET type = ?, rate = ? WHERE id = ?',[ type,rate, id], (err, result) => {
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
    res.status(200).send({success: true,message: 'TYPE & RATE updated successfully',data: result});
  } 
  catch (error) 
  {
    res.status(400).send({success: false,message: 'TYPE & RATE update failed',data: error.message});
  }
};

  



// //DELETE COUNTRY
exports.deletesetting = (req,res) => {
	con.query('DELETE FROM setting WHERE id =?',[req.params.id], (err, rows, response) => {
        if(err)
        {
        //console.log(rows);
			  res.status(400).send({success : false, message: "TYPE & RATE delete failed",data: response});
        }
        else
        {
			  res.status(200).send({success : true, message: "TYPE & RATE delete successfully",data: response});
        }
    })
}