var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const moment = require('moment');


//GET All ASSET_ASSIGN
exports.getassetassign = async (req, res) => {
    try {
      const allassetassign = await new Promise((resolve, reject) => {
        con.query(`SELECT asset_assign.*, DATE_FORMAT(start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date, 
        user.firstname as asset_assign_to, asset.asset_name as asset_name, 
        created_by.firstname as created_by
        FROM asset_assign 
        LEFT JOIN user ON asset_assign.asset_assign_to  = user.user_id 
        LEFT JOIN asset ON asset_assign.asset_id = asset.asset_id
        LEFT JOIN user as created_by ON asset_assign.created_by = created_by.user_id`, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      res.status(200).json({ success: true, message: 'ASSET_ASSIGN find successfully', data: allassetassign });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'ASSET_ASSIGN find failed' });
    }
  };




// GET-ONE ASSET_ASSIGN
exports.getoneassetassign = async (req, res) => {
    try {
      const asset_assign_id = req.params.asset_assign_id; // get the work ID from the request parameters
      const assetassign = await new Promise((resolve, reject) => {
        con.query(
          `SELECT asset_assign.*, DATE_FORMAT(start_date,"%d/%m/%Y") AS start_date, DATE_FORMAT(end_date, "%d/%m/%Y") AS end_date, 
          user.firstname as asset_assign_to, asset.asset_name as asset_name, 
          created_by.firstname as created_by
          FROM asset_assign 
          LEFT JOIN user ON asset_assign.asset_assign_to  = user.user_id 
          LEFT JOIN asset ON asset_assign.asset_id = asset.asset_id
          LEFT JOIN user as created_by ON asset_assign.created_by = created_by.user_id
          WHERE asset_assign.asset_assign_id = ?`, // use a parameterized query to prevent SQL injection attacks
          [asset_assign_id], // pass the work ID as a query parameter
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      if (assetassign.length === 0) { // if no work record found with the given ID
        return res.status(404).json({ success: false, message: 'ASSET_ASSIGN record not found' });
      }
      res.status(200).json({ success: true, message: 'ASSET_ASSIGN record found successfully', data: assetassign[0] });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to get ASSET_ASSIGN record' });
    }
  };




// ADD ASSET_ASSIGN
exports.addassetassign = async (req, res) => {
  let user_data = req.user;
  try {
    const { asset_id, asset_assign_to, start_date, created_by } = req.body;

    // Check if start_date is before or equal to end_date
    // if (moment(start_date).isAfter(end_date)) {
    //   return res.status(400).json({ success: false, message: 'Start date cannot be after end date' });
    // }

    const asset = {
      asset_id: asset_id,
      asset_assign_to: asset_assign_to,
      start_date: moment(start_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      created_by: user_data.user_id
    };
    // Insert the user data with the hashed password
    con.query('INSERT INTO asset_assign SET ?', asset, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: 'Internal server error' });
      }
      res.status(200).json({ success: true, message: 'ASSET_ASSIGN added successfully', data: { asset_id, asset_assign_to, start_date, created_by }, other: results });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'ASSET_ASSIGN add failed' });
  }
};





//Update Asset_Asign
exports.updateassetassign = async (req, res) => {
    try {
      const { end_date } = req.body;
      const { asset_assign_id } = req.params;
  
      // Check if end_date is after or equal to current date
      const currentDate = moment().format('YYYY-MM-DD');
      if (moment(end_date, 'YYYY-MM-DD').isAfter(currentDate)) {
          return res.status(400).json({ success: false, message: 'Start date and end date cannot be earlier than current date' });
      }
  
      const asset = {
        end_date: moment(end_date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      };
  
      con.query('UPDATE asset_assign SET ? WHERE asset_assign_id = ?', [asset, asset_assign_id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ success: false, message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ success: false, message: 'No matching record found' });
        }
        res.status(200).json({ success: true, message: 'ASSET_ASSIGN updated successfully', data: asset_assign_id,end_date, other: results });
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'ASSET_ASSIGN update failed' });
    }
  };
  



  

// DELETE Asset_Assign
exports.deleteassetassign = (req,res) => {
	con.query('DELETE FROM asset_assign WHERE asset_assign_id =?',[req.params.asset_assign_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "ASSET_ASSIGN delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "ASSET_ASSIGN delete successfully",data: response});
        }
    })
}