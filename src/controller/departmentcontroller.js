var con = require('../../config/hrmsconfig.js');

// GET DEPARTMENT
exports.findalldepartment = function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
  const query = `SELECT department.*, user.firstname AS created_by FROM department 
  LEFT JOIN user ON department.created_by = user.user_id 
  WHERE department.dep_name LIKE '%${searchQuery}%' 
  LIMIT ? OFFSET ?`;

  //const query = `SELECT * FROM department WHERE dep_id  LIKE '%${searchQuery}%' OR dep_name  LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM department WHERE dep_id  LIKE '%${searchQuery}%' OR dep_name  LIKE '%${searchQuery}%'`;

  con.query(query, [limit, offset], (err, rows, response) => {
    if (err) 
    {
      res.status(400).send({ success: false, message: "DEPARTMENT Find failed", data: response });
    }
    else {
      con.query(countQuery, (err, result) => {
        if (err) 
        {
          res.status(400).send({ success: false, message: "DEPARTMENT Find failed", data: response });
        } 
        else 
        {
          const total = result[0].total;
          const totalPages = Math.ceil(total / limit);

          const prevPage = page > 1 ? page - 1 : null;
          const nextPage = page < totalPages ? page + 1 : null;

          res.status(200).send({success: true, message: "DEPARTMENT Find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
        }
      });
    }
  });
}



// FIND ONE
exports.findonedepartment = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT department.*, user.firstname AS created_by FROM department 
  LEFT JOIN user ON department.created_by = user.user_id 
  WHERE department.dep_id = ? `,[req.params.dep_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "DEPARTMENT Find failed",data: response});
        }
        else
        {
          let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true, message:"Find One DEPARTMENT Successfully", data:single});        }
    });
};




// ADD DEPARTMENT
exports.adddepartment = async (req, res) => {
  try {
      let user_data = req.user;
      const { dep_name, description } = req.body;

      const departmentnameExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM department WHERE dep_name = ?", [dep_name], (err, result) => {
              if (err) 
              {
                  reject(err);
              } else 
              {
                  resolve(result[0].count > 0);
              }
          });
      });
      // If state_name already exists, send error response
      if (departmentnameExists) 
      {
          res.status(400).send({success: false,message: "DEPARTMENT is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO department SET ?", { dep_name, description,created_by: user_data.user_id, }, (err, result) => {
              if (err) 
              {
                  reject(err);
              } else 
              {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "DEPARTMENT insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "DEPARTMENT insert failed",data: error.message,});
  }
};


//UPDATE DEPARTMENT

{   //  exports.updatedepartment = (req,res) => {
// 	console.log(req.body);
// 	const did = req.params.dep_id;
//     const name = req.body.dep_name;
// 	const des = req.body.description;
    
// 	con.query('UPDATE department SET  dep_name = ?, description = ? WHERE dep_id = ? ',[ name,des,did],(err,result,response)=>{
//         if(err)
//         {
//             res.status(400).send({success : false, message: "DEPARTMENT update failed",data: response});
//         }
//         else
//         {
//             res.status(200).send({success : true, message: "DEPARTMENT update successfully",data: response});
//         }
//     });
// }
}


exports.updatedepartment = async (req, res) => {
    try {
      const id = req.params.dep_id;
      const dname = req.body.dep_name;
      const des = req.body.description;
      // Check if email or contact already exists
      const existingdep = await new Promise((resolve, reject) => {
        con.query(
          'SELECT * FROM department WHERE dep_name = ?  AND dep_id != ?',[dname, id],
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
  
      if (existingdep.length > 0) 
      {
        return res.status(400).send({success: false,message: 'DEPARTMENT-NAME already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE department SET dep_name = ?, description = ? WHERE dep_id = ?',[dname, des, id], (err, result) => {
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
      res.status(200).send({success: true,message: 'DEPARTMENT updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'DEPARTMENT update failed',data: error.message});
    }
  };




//DELETE DEPARTMENT
exports.deletedepartment = (req,res) => {
	con.query('DELETE FROM department WHERE dep_id =?',[req.params.dep_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "DEPARTMENT delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "DEPARTMENT delete successfully",data: response});
        }
    })
}