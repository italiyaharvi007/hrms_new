var con = require('../../config/hrmsconfig.js');
var bcrypt = require("bcrypt");

// GET ADMIN
exports.findalladmin = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
    const query = `SELECT * FROM admin WHERE admin_name LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR contact LIKE '%${searchQuery}%' OR city_id LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM admin WHERE admin_name LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR contact LIKE '%${searchQuery}%' OR city_id LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%'`;
  
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) {
        res.status(400).send({success: false, message: "ADMIN find failed", data: response });
      }
      else {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "ADMIN find failed", data: response });
          } else {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }

  

// FIND ONE
exports.findoneadmin = (req,res) =>{
	console.log(req.params);

	con.query('SELECT * FROM admin WHERE admin_id =?',[req.params.admin_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "ADMIN find failed",data: response});
        }
        else
        {
			res.status(200).send(rows);
        }
    });
};



// UPDATE ADMIN
exports.updateadmin = async (req, res) => {
  try {
    const id = req.params.admin_id;
    const name = req.body.admin_name;
    const email = req.body.email;
    const contact = req.body.contact;
    const username = req.body.user_name;
    const city_id = req.body.city_id;
    const address = req.body.address;

    // Check if email or contact already exists
    const existingadmin = await new Promise((resolve, reject) => {
      con.query(
        'SELECT * FROM admin WHERE (email = ? OR contact = ?) AND admin_id != ?',
        [email, contact, id],
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

    if (existingadmin.length > 0) 
    {
      return res.status(400).send({success: false,message: 'EMAIL or CONTACT already exists'});
    }

    const result = await new Promise((resolve, reject) => {
      con.query(
        'UPDATE admin SET admin_name = ?, email = ?, contact = ?, user_name = ?, city_id = ?, address = ? WHERE admin_id = ?',
        [name, email, contact, username, city_id, address, id], (err, result) => {
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
    res.status(200).send({success: true,message: 'ADMIN updated successfully',data: result});
  } 
  catch (error) 
  {
    res.status(400).send({success: false,message: 'ADMIN update failed',data: error.message});
  }
};




//DELETE ADMIN
exports.deleteadmin = (req,res) => {
	con.query('DELETE FROM admin WHERE admin_id =?',[req.params.admin_id], (err, rows, response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "ADMIN delete failed",data: response});
        }
        else
        {
			    res.status(200).send({success : true, message: "ADMIN delete successfully",data: response});
        }
    })
}