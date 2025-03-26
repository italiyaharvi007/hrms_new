var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');


// FIND BY USER_ID 
exports.findbyuserid = (req, res) => {
    console.log(req.params);
  
    con.query(`SELECT ids.*, user.firstname AS user_id, upload_by.firstname AS upload_by 
               FROM ids 
               LEFT JOIN user ON ids.user_id = user.user_id
               LEFT JOIN user AS upload_by ON ids.upload_by = upload_by.user_id 
               WHERE ids.user_id = ?`, [req.params.user_id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(400).send({ success: false, message: "IDS Find by USER failed", data: null });
      } else {
        res.status(200).send({ success: true, message: "IDS Find by USER successfully", data: rows });
      }
    });
  };
  




//ADD IDS
exports.addids = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
        const { user_id, type,id, upload_by,varification,photo_id,date_of_birth,current_address,permanent_address } = req.body;
        const { filename: image } = req.file;
        if (!image) {
            return res.status(400).json({ message: 'Image file not found' });
        }
        const ids = {
            user_id: user_id,
            type: type,
            id:id,
            upload_by: user_data.user_id,
            image: image,
            photo_id:photo_id,
            date_of_birth:date_of_birth,
            current_address:current_address,
            permanent_address:permanent_address
        };
        // Insert the user data with the hashed password
        con.query('INSERT INTO ids SET ?', ids, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(400).json({ success: false, message: 'Internal server error' });
            }
            res.status(200).json({ success: true, message: 'IDS added successfully', data: {user_id, type,id, upload_by,varification,photo_id,date_of_birth,current_address,permanent_address}, other: results });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'IDS add failed' });
    }
};




//UPDATE IDS
exports.updateids = async (req, res) => {
    const verification = req.body.verification;
    let image = '';
    
    if (req.file) {
        image = req.file.filename; // Get the filename of the uploaded image
    } else {
      return res.status(400).json({ success: false, message: 'Image file not found' });
    }
    console.log(req.file);
    try {
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE ids SET image = ?,  WHERE ids_id = ?', [image, ids_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    
      if (result.affectedRows === 0) {
        return res.status(400).json({ success: false, message: 'No matching record found' });
      }
    
      res.status(200).json({ success: true, message: 'IDS-FILE updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: 'Internal server error' });
    }
  };
  



  //UPDATE VERIFY
  exports.updateverification = async (req, res) => {
    try {
        const { ids_id  } = req.params;
        const { verification } = req.body;

        con.query('UPDATE ids SET verification = ? WHERE ids_id = ?', [verification, ids_id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(400).json({ success: false, message: 'Internal server error' });
            }
            if (results.affectedRows === 0) {
                return res.status(400).json({ success: false, message: 'No matching record found' });
            }
            con.query('SELECT * FROM ids WHERE ids_id = ?', [ids_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(400).json({ success: false, message: 'Internal server error' });
                }
                if (results.length === 0) {
                    return res.status(400).json({ success: false, message: 'No matching record found' });
                }
                res.status(200).json({ success: true, message: 'IDs verified successfully', data: results[0] });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'IDs verified update failed' });
    }
};




//DELETE IDS
exports.deleteids = (req,res) => {
	con.query('DELETE FROM ids WHERE ids_id  =?',[req.params.ids_id ], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "IDS delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "IDC delete successfully",data: response});
        }
    })
}



//LOGIN USER VIEW CERTIFICATE
exports.loginuserids = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let user_data = req.user;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    // con.query(`SELECT ids.*, user.firstname AS user_id, upload_by.firstname AS upload_by 
    // FROM ids 
    // LEFT JOIN user ON ids.user_id = user.user_id
    // LEFT JOIN user AS upload_by ON ids.upload_by = upload_by.user_id 
    // WHERE ids.user_id = ?`, [req.params.user_id], (err, rows) => {
    // ) 

    con.query(`SELECT ids.*,user.firstname AS user_id, upload_by.firstname AS upload_by 
    FROM ids 
    LEFT JOIN user ON ids.user_id = user.user_id
    LEFT JOIN user AS upload_by ON ids.upload_by = upload_by.user_id 
    WHERE ids.user_id = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error retrieving Project' });
      }
      const ids = results;
      req.ids = ids;
      console.log("userId", userId)
      // do something with the attendance records
      res.status(200).json({ status: true, message: "Login User ID's Find Successfully", data: results });
    });
  };
  

