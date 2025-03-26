var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const moment = require('moment');


// GET ALL ASSET
exports.findallasset = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

    const query = `SELECT asset.*,DATE_FORMAT(purchase_date,"%d/%m/%Y") AS purchase_date,DATE_FORMAT(warranty_expiration_date,"%d/%m/%Y") AS warranty_expiration_date, user.firstname AS created_by FROM asset 
    LEFT JOIN user ON asset.created_by = user.user_id 
    WHERE asset.asset_name LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM asset WHERE asset_name  LIKE '%${searchQuery}%'`;

    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "ASSET find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err) {
            res.status(400).send({ success: false, message: "ASSET find failed", data: response });
          } else {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "ASSET find successfully",data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }





  
// GET-ONE ASSET
exports.getoneasset = async (req, res) => {
    try {
      const assetId = req.params.asset_id; // get the work ID from the request parameters
      const asset = await new Promise((resolve, reject) => {
        con.query(
            `SELECT asset.*,DATE_FORMAT(purchase_date,"%d/%m/%Y") AS purchase_date, DATE_FORMAT(warranty_expiration_date, "%d/%m/%Y") AS warranty_expiration_date, user.firstname AS created_by FROM asset
            LEFT JOIN user ON asset.created_by = user.user_id
            WHERE asset.asset_id = ?`, // use a parameterized query to prevent SQL injection attacks
          [assetId], // pass the work ID as a query parameter
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
      });
      if (asset.length === 0) { // if no work record found with the given ID
        return res.status(404).json({ success: false, message: 'ASSET record not found' });
      }
      res.status(200).json({ success: true, message: ' record found successfully', data: asset[0] });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to get ASSET record' });
    }
  };
  

  




// ADD ASSET
exports.addasset = async (req, res) => {
    let user_data = req.user;
   
    try {
      const { asset_name,asset_type,asset_model,serial_number,status,purchase_date,purchase_price,warranty_expiration_date} = req.body;
    
      
      // Check if username, email, and contact are already in use
      const serialnoExists = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM asset WHERE serial_number = ? ', [serial_number], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (serialnoExists.length > 0) {
        return res.status(400).json({ success: false, message: 'serial_number is already store' });
      }
  
      const asset = {
        asset_name: asset_name,
        asset_type: asset_type,
        asset_model: asset_model,
        serial_number: serial_number,
        status: status,
        purchase_date: moment(purchase_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        purchase_price :purchase_price ,
        warranty_expiration_date:moment(warranty_expiration_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        created_by: user_data.user_id
      };
      // Insert the user data with the hashed password
      con.query('INSERT INTO asset SET ?', asset, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        res.status(200).json({ success: true, message: 'ASSET added successfully', data: {asset_name,asset_type,asset_model,serial_number,status,purchase_date,purchase_price,warranty_expiration_date}, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'ASSET add failed' });
    }
  };
  



  // UPDATE ASSET
  exports.updateasset = async (req, res) => {
    try {
      const { asset_name,asset_type,asset_model,serial_number,status,purchase_date,purchase_price,warranty_expiration_date } = req.body;
      const { asset_id } = req.params;
  
      const asset = {
        asset_name: asset_name,
        asset_type: asset_type,
        asset_model: asset_model,
        serial_number: serial_number,
        status: status,
        purchase_date: moment(purchase_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        purchase_price :purchase_price ,
        warranty_expiration_date:moment(warranty_expiration_date, 'YYYY-MM-DD').format('YYYY-MM-DD')
      };
  
      con.query('UPDATE asset SET ? WHERE asset_id = ?', [asset, asset_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'ASSET updated successfully', data: asset, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'ASSET update failed' });
    }
  };
  




    

  
// DELETE ASSET
exports.deleteasset = (req,res) => {
	con.query('DELETE FROM asset WHERE asset_id =?',[req.params.asset_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "ASSET delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "ASSEt delete successfully",data: response});
        }
    })
}