var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');
const dateTime = require('date-and-time');


// FIND BY WORK_DOCUMENT 
exports.findbyuserid = (req, res) => {
    console.log(req.params);
  
    con.query(`SELECT work_document.*,DATE_FORMAT(upload_on,"%d/%m/%Y, %h:%i:%s %p") AS upload_on, user.firstname AS user_name, upload_by.firstname AS upload_by 
               FROM work_document 
               LEFT JOIN user ON work_document.user_id = user.user_id
               LEFT JOIN user AS upload_by ON work_document.upload_by = upload_by.user_id 
               WHERE work_document.user_id = ?`, [req.params.user_id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(400).send({ success: false, message: "WORK_DOCUMENT Find by USER failed", data: null });
      } else {
        res.status(200).send({ success: true, message: "WORK_DOCUMENT Find by USER successfully", data: rows });
      }
    });
  };






//ADD WORK_DOCUMENT
exports.adddocument = async (req, res) => {
    let user_data = req.user;
    console.log(req.file);
    try {
        const { user_id, tittle, description,upload_by } = req.body;
        const { filename: image } = req.file;
        if (!image) {
            return res.status(400).json({ message: 'Image file not found' });
        }
        const workdocument = {
            user_id: user_id,
            tittle: tittle,
            description:description,
            upload_by: user_data.user_id,
            image: image
        };
        // Insert the user data with the hashed password
        con.query('INSERT INTO work_document SET ?', workdocument, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(400).json({ success: false, message: 'Internal server error' });
            }
            res.status(200).json({ success: true, message: 'WORK_DOCUMENT added successfully', data: { user_id, tittle,description, upload_by, image }, other: results });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'WORK_DOCUMENT add failed' });
    }
};





//DELETE WORK_DOCUMENT
exports.deleteworkdocument = (req,res) => {
	con.query('DELETE FROM work_document WHERE workdoc_id   =?',[req.params.workdoc_id  ], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "WORK_DOCUMENT delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "WORK_DOCUMENT delete successfully",data: response});
        }
    })
}




//LOGIN USER VIEW WORK_DOCUMENT
exports.loginuserworkdocument = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let user_data = req.user;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    con.query(`SELECT work_document.*,DATE_FORMAT(upload_on,"%d/%m/%Y, %h:%i:%s %p") AS upload_on,user.firstname AS user_id, upload_by.firstname AS upload_by
    FROM work_document 
    LEFT JOIN user ON work_document.user_id = user.user_id
    LEFT JOIN user AS upload_by ON work_document.upload_by = upload_by.user_id
    WHERE work_document.user_id = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error retrieving Project' });
      }
      const work_document = results;
      req.work_document = work_document;
      console.log("userId", userId)
      // do something with the attendance records
      res.status(200).json({ status: true, message: "Login User work_document Find Successfully", data: results });
    });
  };
  
