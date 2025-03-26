var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');




// FIND BY USER_ID 
exports.findbyuserid = (req, res) => {
    console.log(req.params);
  
    con.query(`SELECT certification.*, upload_by.firstname AS upload_by 
               FROM certification 
               LEFT JOIN user AS upload_by ON certification.upload_by = upload_by.user_id 
               WHERE certification.user_id = ?`, [req.params.user_id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(400).send({ success: false, message: "CERTIFICATE Find by USER failed", data: null });
      } else {
        res.status(200).send({ success: true, message: "CERTIFICATE Find by USER successfully", data: rows });
      }
    });
  };
  




//ADD CERTIFICATION
exports.addcertification = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
        const { user_id, type, upload_by } = req.body;
        const { filename: image } = req.file;
        if (!image) {
            return res.status(400).json({ message: 'Image file not found' });
        }
        const certification = {
            user_id: user_id,
            type: type,
            upload_by: user_data.user_id,
            image: image
        };
        // Insert the user data with the hashed password
        con.query('INSERT INTO certification SET ?', certification, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(400).json({ success: false, message: 'Internal server error' });
            }
            res.status(200).json({ success: true, message: 'CERTIFICATION added successfully', data: { user_id, type, upload_by, image }, other: results });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'CERTIFICATION add failed' });
    }
};



//UPDATE CERTIFICATE
    exports.updatecertification = async (req, res) => {
        try {
            const { certification_id } = req.params;
            const { verification } = req.body;
    
            con.query('UPDATE certification SET verification = ? WHERE certification_id = ?', [verification, certification_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(400).json({ success: false, message: 'Internal server error' });
                }
                if (results.affectedRows === 0) {
                    return res.status(400).json({ success: false, message: 'No matching record found' });
                }
                con.query('SELECT * FROM certification WHERE certification_id = ?', [certification_id], (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(400).json({ success: false, message: 'Internal server error' });
                    }
                    if (results.length === 0) {
                        return res.status(400).json({ success: false, message: 'No matching record found' });
                    }
                    res.status(200).json({ success: true, message: 'CERTIFICATION updated successfully', data: results[0] });
                });
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: 'CERTIFICATION update failed' });
        }
    };
    



//LOGIN USER VIEW CERTIFICATE
exports.loginusercertificare = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let user_data = req.user;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    con.query(`SELECT certification.*, upload_by.firstname AS upload_by
    FROM certification 
    LEFT JOIN user AS upload_by ON certification.upload_by = upload_by.user_id
    WHERE certification.user_id = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error retrieving Project' });
      }
      const certification = results;
      req.certification = certification;
      console.log("userId", userId)
      // do something with the attendance records
      res.status(200).json({ status: true, message: "Login User certification Find Successfully", data: results });
    });
  };
  


  
//DELETE CERTIFICATION
exports.deletecertification = (req,res) => {
	con.query('DELETE FROM certification WHERE certification_id =?',[req.params.certification_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "CERTIFICATION delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "CERTIFICATION delete successfully",data: response});
        }
    })
}

