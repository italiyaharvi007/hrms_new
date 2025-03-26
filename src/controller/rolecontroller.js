var con = require('../../config/hrmsconfig.js');


// GET ROLE
exports.findallrole = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
    const query = `SELECT role.*, user.firstname AS created_by    
    FROM role 
    LEFT JOIN user ON role.created_by = user.user_id 
    WHERE role.role_name LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`;

    // /const query = `SELECT * FROM role WHERE role_name  LIKE '%${searchQuery}%'  LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM role WHERE role_name  LIKE '%${searchQuery}%'`;
  
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "ROLE find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err) 
          {
            res.status(400).send({ success: false, message: "ROLE find failed", data: response });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "ROLE find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }



// FIND ONE
exports.findonerole = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT role.*, user.firstname AS created_by FROM role 
    LEFT JOIN user ON role.created_by = user.user_id 
    WHERE role.role_id =?`,[req.params.role_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "ROLE find failed",data: response});
        }
        else
        {
            let single = (rows.length > 0) ? rows[0] : [];
            res.status(200).send({status:true,message:"Find One Bank-Detail Successfully",data:single});        }
    });
};



// ADD ROLE
exports.addrole = async (req, res) => {
  try {
        let user_data = req.user;
        const { role_name } = req.body;

      const rolenameExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM role WHERE role_name = ?", [role_name], (err, result) => {
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
      if (rolenameExists) 
      {
          res.status(400).send({success: false,message: "ROLE is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO role SET ?", { role_name, created_by: user_data.user_id }, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "ROLE insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "ROLE insert failed",data: error.message,});
  }
};



// UPDATE ROLE
exports.updaterole = async (req,res) => {
	console.log(req.body);
	const rid = req.params.role_id;
    const name = req.body.role_name;
    
    const rolenameExists = await new Promise((resolve, reject) => {
        con.query("SELECT COUNT(*) AS count FROM role WHERE role_name = ?", [name], (err, result) => {
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
    if (rolenameExists) 
    {
        res.status(400).send({success: false,message: "ROLE is already being used",data: null,});
        return;
    }

	con.query('UPDATE role SET role_name = ? WHERE role_id = ? ',[ name,rid],(err,result,response)=>{
        if(err)
        {
            res.status(400).send({success : false, message: "ROLE update failed",data: response});
        }
        else
        {
            res.status(200).send({success : true, message: "ROLE update successfully",data: response});
        }
    });
}


//DELETE ROLE
exports.deleterole = (req,res) => {
	con.query('DELETE FROM role WHERE role_id =?',[req.params.role_id], (err, rows, response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "ROLE delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "ROLE delete successfully",data: response});
        }
    })
}