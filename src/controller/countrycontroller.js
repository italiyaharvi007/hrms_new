var con = require('../../config/hrmsconfig.js');

// GET COUNTRY
exports.findallcountry = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

    const query = `SELECT country.*, user.firstname AS created_by FROM country 
    LEFT JOIN user ON country.created_by = user.user_id 
    WHERE country.country_name LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM country WHERE country_name  LIKE '%${searchQuery}%'`;

    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "COUNTRY find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "COUNTRY find failed", data: response });
          } else {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "COUNTRY find successfully",data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }





// FIND ONE
exports.findonecountry = (req, res) => {
  con.query(`SELECT country.*, user.firstname AS created_by FROM country 
             LEFT JOIN user ON country.created_by = user.user_id 
             WHERE country.country_id = ?`, [req.params.country_id], (err, rows, fields, response) => {
    if (err) {
      console.log(err);
      res.status(400).send({ success: false, message: "COUNTRY find failed", data: response });
    } else {
      let single = (rows.length > 0) ? rows[0] : {};
      res.status(200).send({ success: true, message: "Find One COUNTRY Successfully", data: single });
    }
  });
};




// ADD COUNTRY
// exports.addcountry   = async (req, res) => {
//     try {
//       let user_data = req.user;
//       const { country_name } = req.body;
  
//       const result = await new Promise((resolve, reject) => {
//         con.query("INSERT INTO country (country_name) SELECT ? WHERE NOT EXISTS (SELECT * FROM country WHERE country_name = ?)",
//           {country_name, country_name, created_by: user_data.user_id},
//           (err, result) => {
//             if (err) 
//             {
//               reject(err);
//             } 
//             else 
//             {
//               resolve(result);
//             }
//           }
//         );
//       });
//       // If no rows were affected, it means a record with the same country name already exists
//       if (result.affectedRows === 0) {
//         res.status(400).send({success: false,message: "COUNTRY name already exists",data: null});
//         return;
//       }
//       res.status(200).send({success: true,message: "COUNTRY inserted successfully",data: result});
//     } 
//     catch (error) 
//     {
//       res.status(400).send({success: false,message: "COUNTRY insert failed",data: error.message});
//     }
//   };


exports.addcountry = async (req, res) => {
  try {
      let user_data = req.user;
      const { country_name } = req.body;

      const countryExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM country WHERE country_name = ?", [country_name], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result[0].count > 0);
              }
          });
      });
      // If state_name already exists, send error response
      if (countryExists) 
      {
          res.status(400).send({success: false,message: "COUNTRY-NAME is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO country SET ?", { country_name,  created_by: user_data.user_id }, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "COUNTRY Insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "COUNTRY Insert failed",data: error.message,});
  }
};



// UPDATE COUNTRY
// {exports.updatecountry = async (req, res) => {
//     try {
//       const { country_id } = req.params;
//       const { country_name } = req.body;
  
//       const countrynameExists = await new Promise((resolve, reject) => {
//         con.query("SELECT COUNT(*) AS count FROM country WHERE country_name = ?", [country_name], (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result[0].count > 0);
//           }
//         });
//       });
//       // Country already use
//       if (countrynameExists) {
//         res.status(400).send({success: false,message: "COUNTRY-NAME is already being used",data: null,});
//         return;
//       }
//       const result = await new Promise((resolve, reject) => {
//         con.query(
//           'UPDATE country SET country_name = ? WHERE country_id = ?',[country_name, country_id],(err, result) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           },
//         );
//       });
//       res.status(200).send({success: true,message: "COUNTRY update successfully",data: result,});
//     } 
//     catch (error) 
//     {
//       res.status(400).send({success: false,message: "COUNTRY Update failed",data: error.message});
//     }
//   };}

exports.updatecountry = async (req, res) => {
  try {
    const id = req.params.country_id ;
    const cname = req.body.country_name;

    // Check if email or contact already exists
    const existingstate = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM country WHERE (country_name = ? ) AND country_id != ?',[cname, id],
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

    if (existingstate.length > 0) 
    {
      return res.status(400).send({success: false,message: 'COUNTRY-NAME already exists'});
    }

    const result = await new Promise((resolve, reject) => {
      con.query('UPDATE country SET country_name = ? WHERE country_id = ?',[ cname, id], (err, result) => {
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
    res.status(200).send({success: true,message: 'COUNTRY updated successfully',data: result});
  } 
  catch (error) 
  {
    res.status(400).send({success: false,message: 'COUNTRY update failed',data: error.message});
  }
};

  


//DELETE COUNTRY
exports.deletecountry = (req,res) => {
	con.query('DELETE FROM country WHERE country_id =?',[req.params.country_id], (err, rows, response) => {
        if(err)
        {
        //console.log(rows);
			  res.status(400).send({success : false, message: "COUNTRY delete failed",data: response});
        }
        else
        {
			  res.status(200).send({success : true, message: "COUNTRY delete successfully",data: response});
        }
    })
}