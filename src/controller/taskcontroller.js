var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');


//GET ALL-TASK
exports.findalltask = function (req, res) {
    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provide

    const query = `SELECT task_assign.*, user1.firstname AS assigner_name, user2.firstname AS assign_name FROM task_assign 
    LEFT JOIN user user1 ON task_assign.assigner_id = user1.user_id 
    LEFT JOIN user user2 ON task_assign.assign_id = user2.user_id 
    WHERE task_id  AND (user1.firstname LIKE '%${searchQuery}%' OR user2.firstname LIKE '%${searchQuery}%')  `;

    const countQuery = `SELECT COUNT(*) as total FROM task_assign WHERE task_id`;

    con.query(query,  (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "TASK find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, results) => {
          if (err) {
            res.status(400).send({ success: false, message: "TASK find failed", data: response });
          } else {
            res.status(200).send({ success: true, message: "TASK find successfully", data: rows });
          }
        });
      }
    });
}




// GET-ONE TASK
exports.findonetask = (req, res) => {
  console.log(req.params);

  con.query(`SELECT task_assign.*, DATE_FORMAT(task_assign.due_date	,'%Y-%m-%d') AS due_date, assigner.firstname AS assigner_firstname, assignee.firstname AS assignee_firstname, created_by.firstname AS created_by
   FROM task_assign
   LEFT JOIN user AS assigner ON task_assign.assigner_id  = assigner.user_id
   LEFT JOIN user AS assignee ON task_assign.assign_id  = assignee.user_id
   LEFT JOIN user AS created_by ON task_assign.created_by = created_by.user_id
   WHERE task_id  = ?`, [req.params.task_id ], (err, rows, fields, response) => {
    if (err) {
      console.log(err);
      res.status(400).send({ success: false, message: "Error occurred while fetching the task", error: err });
    }
    else {
      let single = (rows.length > 0) ? rows[0] : {};
      res.status(200).send({ status: true, message: "Task fetched successfully", data: single });
    }
  });
};




// ADD TASK
exports.addtask = async (req, res) => {
    try {
      let user_data = req.user;
      const { assigner_id, assign_id, task_name, description, due_date, priority, status } = req.body;
  
      if (assigner_id == assign_id) {
        res.status(400).send({
          success: false,
          message: "ASSIGNER_ID and ASSIGN_ID cannot be the same",
          data: null,
        });
        return;
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query("INSERT INTO task_assign SET ?", { assigner_id: user_data.user_id, assign_id, task_name, description, due_date, priority, status , created_by: user_data.user_id}, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      res.status(200).send({
        success: true,
        message: "TASK-ASSIGN added successfully",
        data: result
      });
    }
    catch (error) {
      res.status(400).send({
        success: false,
        message: "TASK-ASSIGN failed",
        data: error.message,
      });
    }
  };




  //UPDATE TASK
exports.updatetask = async (req,res) => {
	console.log(req.body);
	const tid = req.params.task_id;
    const status = req.body.status;
    
  	con.query('UPDATE task_assign SET status = ? WHERE task_id = ? ',[ status,tid],(err,result,response)=>{
        if(err)
        {
            res.status(400).send({success : false, message: "TASK update failed",data: response});
        }
        else
        {
            res.status(200).send({success : true, message: "TASK update successfully",data: response});
        }
    });
}




//DELETE LEAVE
exports.deletetask = (req,res) => {
	con.query('DELETE FROM task_assign WHERE task_id =?',[req.params.task_id], (err, rows, response) => {
        if(err)
        {
          //console.log(rows);
			    res.status(400).send({success : false, message: "TASK delete failed",data: response});
        }
        else
        {
			    res.status(200).send({success : true, message: "TASK delete successfully",data: response});
        }
    })
};

