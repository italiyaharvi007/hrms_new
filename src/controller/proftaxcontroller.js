var con = require('../../config/hrmsconfig.js');

//  FIND ALL PROFESSIONAL-TAX
exports.findallsetting = function (req, res) {
   
      const query = `SELECT professional_tax.*, user.firstname AS created_by FROM professional_tax 
    LEFT JOIN user ON professional_tax.created_by = user.user_id 
    WHERE professional_tax.id`;
  
        con.query(query, (err, rows, response) => {
      if (err) {
        res.status(400).send({ success: false, message: "SETTING find failed", data: err });
      } else {
            res.status(200).send({ success: true, message: "SETTING find successfully", data: rows});
          }
      })
}





// ADD PROFESSIONAL-TAX
exports.addsproftax = async (req, res) => {
    try {
        let user_data = req.user;
        const { start_salary } = req.body;
        const { end_salary } = req.body;
        const { amount } = req.body;

        const amountExists = await new Promise((resolve, reject) => {
            con.query("SELECT COUNT(*) AS count FROM professional_tax WHERE amount = ?", [amount], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
        // If state_name already exists, send error response
        if (amountExists) 
        {
            res.status(400).send({success: false,message: "AMOUNT is already being used",data: null,});
            return;
        }
  
        const result = await new Promise((resolve, reject) => {
            con.query("INSERT INTO professional_tax SET ?", {start_salary, end_salary, amount,  created_by: user_data.user_id }, (err, result) => {
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
exports.updateproftax = async (req, res) => {
    try {
      const id = req.params.id ;
      const start_salary = req.body.start_salary;
      const end_salary = req.body.end_salary;
      const amount = req.body.amount;

      // Check if email or contact already exists
      const existingamount = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM professional_tax WHERE (amount = ? ) AND id != ?',[amount, id],
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
        return res.status(400).send({success: false,message: 'AMOUNT already exists'});
      }
  
      const result = await new Promise((resolve, reject) => {
        con.query('UPDATE professional_tax SET start_salary = ?, end_salary = ?, amount = ? WHERE id = ?',[ start_salary,end_salary,amount, id], (err, result) => {
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
      res.status(200).send({success: true,message: 'PROF-TAX updated successfully',data: result});
    } 
    catch (error) 
    {
      res.status(400).send({success: false,message: 'PROF-TAX update failed',data: error.message});
    }
  };
  
    
  
  
  
//DELETE COUNTRY
exports.deleteproftax = (req,res) => {
	con.query('DELETE FROM professional_tax WHERE id =?',[req.params.id], (err, rows, response) => {
        if(err)
        {
        //console.log(rows);
			  res.status(400).send({success : false, message: "PROF-TAD delete failed",data: response});
        }
        else
        {
			  res.status(200).send({success : true, message: "PROF-TAD delete successfully",data: response});
        }
    })
}