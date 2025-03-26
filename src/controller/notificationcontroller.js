var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');


// FIND-ALL NOTIFICATION
exports.findallnotification = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({success : false, message:'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const query = `SELECT notification.*, user.firstname FROM notification LEFT JOIN user ON notification.from_id = user.user_id WHERE to_id = ${userId} ORDER BY not_id DESC LIMIT ${limit} OFFSET ${offset}`;

    const countQuery = 'SELECT COUNT(*) as total FROM notification';

    con.query(countQuery, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({success : false, message:'Error retrieving NOTIFICATION count' });
        }

        const total = result[0].total;
        const totalPages = Math.ceil(total / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        con.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(400).json({success : false, message:'Error retrieving NOTIFICATION' });
            }

            const notification = results;
            req.notification = notification;
            console.log("userId", userId)
            // do something with the attendance records
            res.status(200).json({success : true, message: "NOTIFICATION find successfully",data:notification ,pagination: { total, page, limit, totalPages, prevPage, nextPage } });
        });
    });
};




//TOP 10 UNREAD NOTIFICATION
exports.unreadnotification = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({success : false, message:'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    con.query(`SELECT notification.*, user.firstname FROM notification LEFT JOIN user ON notification.from_id = user.user_id WHERE is_read = 0 AND to_id = ${userId} ORDER BY created_at DESC LIMIT 10`, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({success : false, message: 'Error retrieving NOTIFICATION' });
        }

        const notification = results;
        req.notification = notification;
        console.log("userId", userId)
        // do something with the attendance records
        res.status(200).json({success : true, message: "NOTIFICATION find successfully",data: notification });
    });
};





//Update Notification
exports.updatenotification = async (req,res) => {
	const not_id = req.params.not_id;
    const is_read = req.body.is_read;

	con.query('UPDATE notification SET is_read = 1 WHERE not_id = ? ',[not_id],(err,result,response)=>{
        if(err)
        {
            res.status(400).send({success : false, message: "NOTIFICATION update failed",data: response});
        }
        else
        {
            res.status(200).send({success : true, message: "NOTIFICATION update successfully",data: { is_read,not_id },other:response});
        }
    });
}





//DELETE NOTIFICATION
exports.deletenotification = (req,res) => {
	con.query('DELETE FROM notification WHERE not_id =?',[req.params.not_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "NOTIFICATION delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "NOTIFICATION delete successfully",data: response});
        }
    })
}





// DELETE SELECTED NOTIFICATION
exports.deleteselectednotifications = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    const notificationIds = req.body.notificationIds;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid notification IDs' });
    }
  
    const queryPromises = notificationIds.map(notificationId => {
      return new Promise((resolve, reject) => {
        con.query(`DELETE FROM notification WHERE not_id = ${notificationId} AND to_id = ${userId}`, (err, results) => {
          if (err) {
            console.error(err);
            reject(`Error deleting notification ${notificationId}`);
          } else {
            console.log(`Deleted notification ${notificationId}`);
            resolve(`Deleted notification ${notificationId}`);
          }
        });
      });
    });
  
    Promise.all(queryPromises)
      .then(results => {
        console.log(results);
        res.status(200).json({ success: true, message: 'Selected notifications have been deleted successfully' });
      })
      .catch(error => {
        console.error(error);
        res.status(400).json({ success: false, message: 'Error deleting selected notifications' });
      });
  };
  






  
//Delete All Notification
exports.deleteallnotification = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({success:false,message:'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    con.query(`DELETE FROM notification WHERE to_id = ${userId}`, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({success : false, message:'Error deleting NOTIFICATION' });
        }
        const notifications = results;
        req.notifications = notifications;
        console.log("userId", userId)
        // do something with the attendance records
        res.status(200).json({success : true, message:  "Delete all NOTIFICATION Successfully",data: notifications});
    });

}







//Top 10 unseen notification count Show
exports.countnotification = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; 
    con.query(`SELECT COUNT(*) AS count FROM notification WHERE is_read = 0 AND to_id = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ success : false, message:'Error retrieving NOTIFICATION' });
      }
  
      const notification = results;
      req.notification = notification;
      console.log("userId",userId)
      // do something with the attendance records
      res.status(200).json({ success : true, message: "NOTIFICATION find successfully", data:notification });
    });
  };





//Update ALL Notification
exports.updateallnotification = async (req,res) => {
	const id = req.params.id;
    const is_read = req.body.is_read;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({success:false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

	con.query(`UPDATE notification SET is_read = 1 AND to_id = ${userId}`,(err,results,response)=>{
        if(err)
        {
            res.status(400).send({success : false, message: "NOTIFICATION update failed",data: response});
        }
        const notifications = results;
        req.notifications = notifications;
        console.log("userId", userId)
        // do something with the attendance records
        res.status(200).json({success : true, message: "read NOTIFICATION Successfully", data:notifications});
    });
}





// UPDATE SELECTED NOTIFICATION
exports.updateselectednotification = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    const notificationIds = req.body.notificationIds;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid notification IDs' });
    }
  
    const query = `UPDATE notification SET is_read = 1 WHERE to_id = ${userId} AND not_id IN (${notificationIds.join(',')})`;
    con.query(query, (err, results, response) => {
      if (err) {
        res.status(400).send({ success: false, message: 'Failed to update notifications', data: response });
      } else {
        console.log(`Updated ${results.affectedRows} notifications`);
        res.status(200).json({ success: true, message: 'Notifications have been marked as read successfully', data: results });
      }
    });
  };
  




//Count All Notification Login_user
exports.countnotallification = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({success:false, error:'No token provided'});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    con.query(`SELECT COUNT(*) AS count FROM notification WHERE to_id = ${userId}`, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(400).json({success : false, message:'Error retrieving NOTIFICATION'});
        }

        const notifications = results;
        req.notifications = notifications;
        console.log("userId", userId)
        // do something with the attendance records
        res.status(200).json({success : true, message: "Count NOTIFICATION Successfully", data:notifications});
    });
};

