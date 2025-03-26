var con = require('../../config/hrmsconfig.js');

// GET TECHNOLOGY
exports.findalltechnology = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

    const query = ` SELECT technology.*, department.dep_name, created_by.firstname AS created_by
    FROM technology
    LEFT JOIN department ON technology.dep_id = department.dep_id
    LEFT JOIN user AS created_by ON technology.created_by = created_by.user_id
    WHERE technology.tec_id LIKE '%${searchQuery}%' OR technology.tec_name LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`;


    const countQuery = `SELECT COUNT(*) as total FROM technology WHERE tec_id LIKE '%${searchQuery}%' OR tec_name LIKE '%${searchQuery}%'`;
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "TECHNOLOGY find failed", data: response });
      }
      else {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "TECHNOLOGY find failed", data: response });
          } else {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({success: true, message: "TECHNOLOGY find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }


  
// FIND ONE 
exports.findonetechnology = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT technology.*, department.dep_name, created_by.firstname AS created_by FROM technology
  LEFT JOIN department ON technology.dep_id = department.dep_id
  LEFT JOIN user AS created_by ON technology.created_by = created_by.user_id
  WHERE tec_id =?`,[req.params.tec_id], (err, rows, fields,response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "TECHNOLOGY find failed",data: response});
        }
        else
        {
          let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true, message:"Find One TECHNOLOGY Successfully", data:single});         }
    });
};


// ADD TECHNOLOGY
exports.addtechnology = async (req, res) => {
  try {
        let user_data = req.user;
        const { tec_name, dep_id } = req.body;

      const teqnameExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM technology WHERE tec_name = ?", [tec_name], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result[0].count > 0);
              }
          });
      });
      // If tec_name already exists, send error response
      if (teqnameExists) 
      {
          res.status(400).send({success: false,message: "TECHNOLOGY name is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO technology SET ?", { tec_name, dep_id , created_by: user_data.user_id}, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "TECHNOLOGY insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "TECHNOLOGY insert failed",data: error.message,});
  }
};


// UPDATE TECHNOLOGY
// exports.updatetechnology = (req,res) => {
// 	console.log(req.body);
// 	const tid = req.params.tec_id;
// 	const name = req.body.tec_name;
// 	const did = req.body.dep_id;

// 	con.query('UPDATE technology SET tec_name = ? , dep_id = ?  WHERE tec_id = ? ',[ name,did,tid],(err,result,response)=>{
//         if(err)
//         {
//             res.status(400).send({success : false, message: "TECHNOLOGY Update failed",data: response});
//         }
//         else
//         {
//             res.status(200).send({success : true, message: "TECHNOLOGY Update successfully",data: response});
//         }
//     });
// }

exports.updatetechnology = async (req, res) => {
    try {
      const tid = req.params.tec_id;
      const tname = req.body.tec_name;
      const did = req.body.dep_id;
  
      // Check if email or contact already exists
      const existingtec = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM technology WHERE (tec_name = ? ) AND tec_id != ?',[tname, tid],
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
  
      if (existingtec.length > 0) 
      {
        return res.status(400).send({success: false,message: 'TECHNOLOGY-NAME already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE technology SET tec_name = ?, dep_id = ? WHERE tec_id = ?',[ tname, did, tid], (err, result) => {
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
      res.status(200).send({success: true,message: 'TECHNOLOGY updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'TECHNOLOGY update failed',data: error.message});
    }
  };




//DELETE TECHNOLOGY
exports.deletetechnology = (req,res) => {
	con.query('DELETE FROM technology WHERE tec_id =?',[req.params.tec_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "TECHNOLOGY delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "TECHNOLOGY delete successfully",data: response});
        }
    })
}




// FIND BY DEPARTMENT ID 
exports.findbydep = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT technology.*, department.dep_name, created_by.firstname AS created_by FROM technology
  LEFT JOIN department ON technology.dep_id = department.dep_id
  LEFT JOIN user AS created_by ON technology.created_by = created_by.user_id
  WHERE department.dep_id = ?`,[req.params.dep_id], (err, rows, fields,response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "TECHNOLOGY Findby DEPARTMENT failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "TECHNOLOGY Findby DEPARTMENT successfully", data: rows});
        }
    });
};
