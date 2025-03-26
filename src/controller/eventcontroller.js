var con = require('../../config/hrmsconfig.js');


//FindAll Event
exports.findallevent = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided
  
    const query = `SELECT event.*,DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date,DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date,created_by.firstname AS created_by
    FROM event
    LEFT JOIN user AS created_by ON event.created_by = created_by.user_id
    WHERE event.event_id LIKE '%${searchQuery}%' OR event.event_tittle LIKE '%${searchQuery}%'
    LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM event WHERE  event_id LIKE '%${searchQuery}%' OR event_tittle LIKE '%${searchQuery}%'`;
  
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "EVENT find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err) 
          {
            res.status(400).send({ success: false, message: "EVENT find failed", data: response });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "EVENT find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }




// FIND-ONE EVENT
exports.findoneevent = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT event.*,DATE_FORMAT(start_date,"%m/%d/%Y") AS start_date,DATE_FORMAT(end_date, "%m/%d/%Y") AS end_date, created_by.firstname AS created_by 
  FROM event 
  LEFT JOIN user AS created_by ON event.created_by = created_by.user_id  WHERE event_id = ?`
    ,[req.params.event_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
			      res.status(400).send({success:false, message:"EVENT find failed", data: response});
        }
        else
        {
          let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true, message:"Find One EVENT Successfully", data:single});        }
    });
};




// ADD Event
// exports.addevent = async (req, res) => {
//     try {
//         let user_data = req.user;
//         const { event_id, event_tittle,start_date,end_date,description,created_by } = req.body;

//         const result = await new Promise((resolve, reject) => {
//             con.query("INSERT INTO event SET ?", { event_id, event_tittle,start_date,end_date,description,created_by,created_by: user_data.user_id }, (err, result) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//             });
//         });
//         res.status(200).send({success: true,message: "Event insert successfully",data: result,});
//     } 
//     catch (error)
//     {
//         res.status(400).send({success: false,message: "Event insert failed",data: error.message,});
//     }
// };


{
// exports.addevent = async (req, res) => {
//   try {
//     let user_data = req.user;
//     const { event_id, event_tittle, start_date, end_date, description, created_by } = req.body;

//     const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

//     if (!isValidDate(start_date) || !isValidDate(end_date)) {
//       res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
//       return;
//     }
//     const startDateObj = new Date(start_date);
//     const endDateObj = new Date(end_date);

//     // Check if start_date is before end_date
//     if (startDateObj > endDateObj) {
//       res.status(400).send({ success: false, message: "Start date must be before end date.", data: null });
//       return;
//     }
//     const result = await new Promise((resolve, reject) => {
//       con.query("INSERT INTO event SET ?", { event_id, event_tittle, start_date: startDateObj, end_date: endDateObj, description, created_by, created_by: user_data.user_id }, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//     res.status(200).send({ success: true, message: "Event insert successfully", data: result, });
//   }
//   catch (error) {
//     res.status(400).send({ success: false, message: "Event insert failed", data: error.message, });
//   }
// };
}



exports.addevent = async (req, res) => {
  try {
    let user_data = req.user;
    const { event_id, event_tittle, start_date, end_date, description, created_by } = req.body;
    

    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      res.status(400).send({ success: false, message: "Invalid date format. Please use the format YYYY-MM-DD.", data: null });
      return;
    }
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    // Check if start_date is before end_date
    if (startDateObj > endDateObj) {
      res.status(400).send({ success: false, message: "Start date must be before end date.", data: null });
      return;
    }
    const currentDate = new Date();
    if (new Date(start_date) < currentDate || new Date(end_date) < currentDate) {
      res.status(400).send({ success: false, message: 'Start date and end date must be after current date.' });
      return;
    }

    const result = await new Promise((resolve, reject) => {
      con.query("INSERT INTO event SET ?", { event_id, event_tittle, start_date: startDateObj, end_date: endDateObj, description, created_by, created_by: user_data.user_id }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const getUsersQuery = "SELECT * FROM user";
    const users = await new Promise((resolve, reject) => {
      con.query(getUsersQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Insert event notification for each user
    for (let i = 0; i < users.length; i++) {
      const user_data = users[i];
      let userdata = req.user;
      // if (user_data.user_id === user_data.user_id) continue; // skip the user who created the event
      const notificationMessage = `New event request from User ${userdata.name}.`;

      await new Promise((resolve, reject) => {
        con.query('INSERT INTO notification SET ?', { from_id: userdata.user_id, to_id: user_data.user_id, type: 'event', message: notificationMessage, is_read: 0, req_id: result.insertId},
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
      });
    }
    res.status(200).send({ success: true, message: "EVENT insert successfully", data: { event_id, event_tittle, start_date: startDateObj, end_date: endDateObj, description, created_by, created_by: user_data.user_id },other:{ leaveResult: result } });
  } 
  catch (error) {
    res.status(400).send({ success: false, message: "EVENT insert failed", data: error.message, });
  }
};






//update Event
exports.updateevent = async (req, res) => {
    try {
      const event_id = req.params.event_id;
      const event_tittle = req.body.event_tittle;
      const start_date = req.body.start_date;
      const end_date = req.body.end_date;
      const description = req.body.description;
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE event SET event_tittle = ?, start_date = ?,end_date = ?,description = ? WHERE event_id = ?',[ event_tittle,start_date,end_date,description,event_id], (err, result) => {
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
      res.status(200).send({success: true,message: 'EVENT updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'EVENT update failed',data: error.message});
    }
  };


//DELETE EVENt
exports.deleteevent = (req,res) => {
	con.query('DELETE FROM event WHERE event_id =?',[req.params.event_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success:false, message: "EVENT delete failed", data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "EVENT delete successfully", data: response});
        }
    })
}