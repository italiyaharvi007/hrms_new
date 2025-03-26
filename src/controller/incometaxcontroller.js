var con = require('../../config/hrmsconfig.js');

//  FIND ALL INCOME-TAX
exports.findallincometax = function (req, res) {
   
      const query = `SELECT income_tax.*, user.firstname AS created_by FROM income_tax 
    LEFT JOIN user ON income_tax.created_by = user.user_id 
    WHERE income_tax.id`;
  
    
    con.query(query, (err, rows, response) => {
      if (err) {
        res.status(400).send({ success: false, message: "INCOME_TAX find failed", data: err });
      } else {
            res.status(200).send({ success: true, message: "INCOME_TAX find successfully", data: rows});
          }
      })
}

  



// ADD INCOME_TAX
exports.addincometax = async (req, res) => {
    try {
        let user_data = req.user;
        const { start_range } = req.body;
        const { end_range } = req.body;
        const { percentage } = req.body;

        const percentageExists = await new Promise((resolve, reject) => {
            con.query("SELECT COUNT(*) AS count FROM income_tax WHERE percentage = ?", [percentage], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
        // If state_name already exists, send error response
        if (percentageExists) 
        {
            res.status(400).send({success: false,message: "percentage is already being used",data: null,});
            return;
        }
  
        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO income_tax SET ?", {start_range, end_range, percentage ,  created_by: user_data.user_id }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send({success: true,message: "PROF-TAX detail Insert successfully",data: result,});
    } 
    catch (error)
    {
        res.status(400).send({success: false,message: "PROF-TAX detail Insert failed",data: error.message,});
    }
  };
  
  


  
// UPDATE PROFESSIONAL-TAX
exports.updateincometax = async (req, res) => {
    try {
      const id = req.params.id ;
      const start_range = req.body.start_range;
      const end_range = req.body.end_range;
      const percentage = req.body.percentage;

      // Check if email or contact already exists
      const existingamount = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM income_tax WHERE (percentage = ? ) AND id != ?',[percentage, id],
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
  
      if (existingamount.length > 0) 
      {
        return res.status(400).send({success: false,message: 'PERCENTAGE already exists'});
      }
        const result = await new Promise((resolve, reject) => {
        con.query('UPDATE income_tax SET start_range = ?, end_range = ?, percentage = ? WHERE id = ?',[ start_range,end_range,percentage, id], (err, result) => {
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
      res.status(200).send({success: true,message: 'PERCENTAGE updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'PERCENTAGE update failed',data: error.message});
    }
  };
  
    
  
  
  
//DELETE COUNTRY
exports.deleteincometax = (req,res) => {
	con.query('DELETE FROM income_tax WHERE id =?',[req.params.id], (err, rows, response) => {
        if(err)
        {
        //console.log(rows);
			  res.status(400).send({success : false, message: "INCOME-TAX delete failed",data: response});
        }
        else
        {
			  res.status(200).send({success : true, message: "INCOME-TAX delete successfully",data: response});
        }
    })
}