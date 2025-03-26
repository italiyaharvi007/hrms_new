var con = require('../../config/hrmsconfig.js');

// GET STATE
exports.findallstate = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
    const query = ` SELECT state.*, country.country_name, created_by.firstname AS created_by
    FROM state
    LEFT JOIN country ON state.country_id = country.country_id
    LEFT JOIN user AS created_by ON state.created_by = created_by.user_id
    WHERE state.state_id LIKE '%${searchQuery}%' OR state.state_name LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`;
    
    //const query = `SELECT * FROM state WHERE state_id LIKE '%${searchQuery}%' OR state_name LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM state WHERE  state_id LIKE '%${searchQuery}%' OR state_name LIKE '%${searchQuery}%'`;
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(404).send({ success: false, message: "STATE find failed", data: response });
      }
      else {
        con.query(countQuery, (err, result) => {
          if (err) 
          {
            res.status(400).send({ success: false, message: "STATE find failed", data: response });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "STATE find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }




// FIND ONE 
// exports.findonestate = (req,res) =>{
// 	console.log(req.params);
// 	const state = req.body.state_name;
    
// 	con.query(`SELECT state.*, country.country_name, created_by.firstname AS created_by FROM state
//   LEFT JOIN country ON state.country_id = country.country_id
//   LEFT JOIN user AS created_by ON state.created_by = created_by.user_id
//   WHERE state_id = ?`,[req.params.state_id], (err, rows, fields,response) => {
//         if(err)
//         {
// 			    res.status(400).send({success : false, message: "STATE find failed",data: response});
//         }
//         else
//         {
//           let single = (rows.length > 0) ? rows[0] : [];
//           res.status(200).send({status:true,message:"Find One STATE Successfully",data:single});         
//         }
//     });
// };

exports.findonestate = (req,res) =>{
	console.log(req.params);
	
	con.query(`SELECT state.*, country.country_name, created_by.firstname AS created_by FROM state
  	LEFT JOIN country ON state.country_id = country.country_id
  	LEFT JOIN user AS created_by ON state.created_by = created_by.user_id
  	WHERE state.state_id = ?`, [req.params.state_id], (err, rows) => {
        
        if(err)
        {
			res.status(400).send({success : false, message: "STATE find failed", data: err});
        }
        else
        {
          	if(rows.length > 0) {
          		const single = rows[0];
          		res.status(200).send({success:true, message:"Find One STATE Successfully", data:single});   
          	} else {
          		res.status(404).send({success:false, message:"STATE not found"});
          	}   
        }
    });
};






// ADD STATE
exports.addstate = async (req, res) => {
    try {
        let user_data = req.user;
        const { state_name, country_id } = req.body;

        const statenameExists = await new Promise((resolve, reject) => {
            con.query("SELECT COUNT(*) AS count FROM state WHERE state_name = ?", [state_name], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
        // If state_name already exists, send error response
        if (statenameExists) 
        {
            res.status(400).send({success: false,message: "statename is already being used",data: null,});
            return;
        }

        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO state SET ?", { state_name, country_id, created_by: user_data.user_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send({success: true,message: "STATE Insert successfully",data: result,});
    } 
    catch (error)
    {
        res.status(400).send({success: false,message: "STATE Insert failed",data: error.message,});
    }
};





// UPDATE STATE
// {exports.updatestate = async (req, res) => {
//     try {
//         const { state_id } = req.params;
//         const { state_name } = req.body;
//         const { country_id } = req.body;

//         const statenameExists = await new Promise((resolve, reject) => {
//             con.query("SELECT COUNT(*) AS count FROM state WHERE state_name = ?", [state_name], (err, result) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result[0].count > 0);
//                 }
//             });
//         });
//         // state already use
//         if (statenameExists) {
//             res.status(400).send({success: false,message: "statename is already being used",data: null,});
//             return;
//         }
//         const result = await new Promise((resolve, reject) => {
//             con.query('UPDATE state SET state_name = ?,country_id = ? WHERE state_id = ?',[state_name, country_id, state_id],
//                 (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 },
//             );
//         });
//         res.status(200).send({success: true,message: "STATE Update successfully",data: result,});
//     } 
//     catch (error) 
//     {
//         res.status(400).send({success: false,message: "STATE Update failed",data: error.message,});
//     }
// };}

exports.updatestate = async (req, res) => {
    try {
      const id = req.params.state_id;
      const statename = req.body.state_name;
      const cid = req.body.country_id;
  
      // Check if email or contact already exists
      const existingstate = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM state WHERE (state_name = ? ) AND state_id != ?',[statename, id],
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
        return res.status(400).send({success: false,message: 'STATE-NAME already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE state SET state_name = ?, country_id = ? WHERE state_id = ?',[ statename, cid, id], (err, result) => {
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
      res.status(200).send({success: true,message: 'STATE updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'STATE update failed',data: error.message});
    }
  };



  

//DELETE STATE
exports.deletestate = (req,res) => {
	con.query('DELETE FROM state WHERE state_id =?',[req.params.state_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "STATE delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "STATE delete successfully",data: response});
        }
    })
}




// FIND BY COUNTRY 
exports.findbycountry = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT state.*, country.country_name, created_by.firstname AS created_by FROM state
  LEFT JOIN country ON state.country_id = country.country_id
  LEFT JOIN user AS created_by ON state.created_by = created_by.user_id
  WHERE country.country_id =?`,[req.params.country_id], (err, rows, fields,response) => {
        if(err)
        {
			res.status(400).send({success : false, message: "STATE Find by COUNTRY failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "STATE Find by COUNTRY successfully",data:rows});
        }
    });
};