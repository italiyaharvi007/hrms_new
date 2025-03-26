var con = require('../../config/hrmsconfig.js');

// GET SUB-DEPARTMENT
exports.findallsubdepartment = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

    const query = `SELECT sub_department.*, department.dep_name AS department_name, user.firstname AS created_by FROM sub_department 
    LEFT JOIN department ON sub_department.dep_id = department.dep_id
    LEFT JOIN user ON sub_department.created_by = user.user_id
    WHERE sub_department.subdepartment_name LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`;
  
    const countQuery = `SELECT COUNT(*) as total FROM sub_department WHERE sub_dep_id  LIKE '%${searchQuery}%' OR subdepartment_name  LIKE '%${searchQuery}%'`;
  
    con.query(query, [limit, offset], (err, rows) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "SUB-DEPARTMENT Find failed", data: err });
      }
      else {
        con.query(countQuery, (err, result) => {
          if (err) 
          {
            res.status(400).send({ success: false, message: "SUB-DEPARTMENT Find failed", data: err });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({success: true, message: "SUB-DEPARTMENT Find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  };




// FIND ONE SUB-DEPARTMENT
exports.findonesubdepartment = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT sub_department.*, department.dep_name AS dep_id, user.firstname AS created_by FROM sub_department 
  LEFT JOIN department ON sub_department.dep_id = department.dep_id 
  LEFT JOIN user ON sub_department.created_by = user.user_id 
  WHERE sub_department.sub_dep_id = ? `,[req.params.sub_dep_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "SUB-DEPARTMENT Find failed",data: response});
        }
        else
        {
          let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true, message:"Find One SUB-DEPARTMENT Successfully", data:single});        }
    });
};




  



// ADD SUB-DEPARTMENT
exports.addsubdepartment = async (req, res) => {
    try {
        let user_data = req.user;
        const { dep_id,subdepartment_name } = req.body;
  
        const subdepartmentnameExists = await new Promise((resolve, reject) => {
            con.query("SELECT COUNT(*) AS count FROM sub_department WHERE subdepartment_name = ?", [subdepartment_name], (err, result) => {
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
        if (subdepartmentnameExists) 
        {
            res.status(400).send({success: false,message: "SUB-DEPARTMENT is already being used",data: null,});
            return;
        }
  
        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO sub_department SET ?", { dep_id, subdepartment_name,created_by: user_data.user_id, }, (err, result) => {
                if (err) 
                {
                    reject(err);
                } else 
                {
                    resolve(result);
                }
            });
        });
        res.status(200).send({success: true,message: "SUB-DEPARTMENT insert successfully",data:{dep_id, subdepartment_name}});
    } 
    catch (error)
    {
        res.status(400).send({success: false,message: "SUB-DEPARTMENT insert failed",data: error.message,});
    }
  };
  



// UPDATE SUB-DEPARTMENt
  exports.updatesubdepartment = async (req, res) => {
    try {
      const sub_dep_id = req.params.sub_dep_id;
      const dep_id = req.body.dep_id;
      const subdepartment_name = req.body.subdepartment_name;
      // Check if email or contact already exists
      const existingdep = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM sub_department WHERE dep_id = ? AND subdepartment_name = ?',[dep_id,subdepartment_name],(err, result) => {
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
        return res.status(400).send({success: false,message: 'SUBDEPARTMENT-NAME already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE sub_department SET dep_id = ?, subdepartment_name = ? WHERE sub_dep_id = ?',[dep_id, subdepartment_name, sub_dep_id], (err, result) => {
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
      res.status(200).send({success: true,message: 'SUB-DEPARTMENT updated successfully',data:{ dep_id, subdepartment_name}});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'SUB-DEPARTMENT update failed',data: error.message});
    }
  };



// DELETE SUB-DEPARTMENT
  exports.deletesubdepartment = (req,res) => {
	con.query('DELETE FROM sub_department WHERE sub_dep_id =?',[req.params.sub_dep_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "SUB-DEPARTMENT delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "SUB-DEPARTMENT delete successfully",data: response});
        }
    })
}