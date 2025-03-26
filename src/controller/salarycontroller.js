var con = require('../../config/hrmsconfig.js');
const jwt = require('jsonwebtoken');

// GET SALARY
exports.findallsalary = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || ''; // get the search query parameter and set to empty string if not provided

    const query = `SELECT salary.*, user.username, user.firstname AS created_by 
    FROM salary 
    LEFT JOIN user ON salary.user_id = user.user_id 
    LEFT JOIN user AS created_by ON user.created_by = created_by.user_id
    WHERE user.username LIKE '%${searchQuery}%' OR salary LIKE '%${searchQuery}%' 
    LIMIT ? OFFSET ?`

    //const query = `SELECT * FROM salary WHERE salary_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR salary  LIKE '%${searchQuery}%' OR bank_detail  LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM salary WHERE salary_id  LIKE '%${searchQuery}%' OR user_id  LIKE '%${searchQuery}%' OR salary  LIKE '%${searchQuery}%' OR bank_detail  LIKE '%${searchQuery}%'`;
  
    con.query(query, [limit, offset], (err, rows, response) => {
      if (err) 
      {
        res.status(400).send({ success: false, message: "SALARY find failed", data: response });
      }
      else 
      {
        con.query(countQuery, (err, result) => {
          if (err)
          {
            res.status(400).send({ success: false, message: "SALARY find failed", data: response });
          } 
          else 
          {
            const total = result[0].total;
            const totalPages = Math.ceil(total / limit);
  
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
  
            res.status(200).send({ success: true, message: "SALARY find successfully", data: rows, pagination: { total, totalPages, page, prevPage, nextPage } });
          }
        });
      }
    });
  }


 
// FIND ONE
exports.findonesalary = (req,res) =>{
	console.log(req.params);

    con.query(`SELECT salary.*, user.username, user.firstname AS created_by FROM salary
    LEFT JOIN user ON salary.user_id = user.user_id 
    WHERE salary_id = ?`,[req.params.salary_id], (err, rows,response) => {
        if(err)
        {
            //console.log(rows);
		    res.status(400).send({success : false, message: "SALARY find failed",data: response});
        }
        else
        {
            let single = (rows.length > 0) ? rows[0] : [];
            res.status(200).send({status:true,message:"Find One SALARY Successfully",data:single});    
        }
    });
};




// ADD SALARY
{ // SIMPLE INSERT
// exports.addsalary = (req, res) => {
//     console.log(req.body);
//     const { user_id} = req.body;
// 	const { salary} = req.body;
// 	const { bank_detail} = req.body;

// 	con.query('INSERT INTO salary SET ?', { user_id: user_id, salary: salary, bank_detail:bank_detail}, (err, results,response) => {
// 		if (err) 
//             {
//                 res.status(400).send({success : false, message: "SALARY insert failed",data: response});
//             } 
//             else 
// 			{
// 				res.status(200).send({success : true, message: "SALARY insert successfully",data: response});

// 			}
// 	})
// }
}


exports.addsalary = async (req, res) => {
  try {
        let user_data = req.user;
        const { user_id, salary, bank_detail } = req.body;

      const detailExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM salary WHERE bank_detail = ?", [bank_detail], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result[0].count > 0);
              }
          });
      });
      // If state_name already exists, send error response
      if (detailExists) 
      {
          res.status(400).send({success: false,message: "BANK_DETAIL is already being used",data: null,});
          return;
      }

      const result = await new Promise((resolve, reject) => {
          con.query("INSERT INTO salary SET ?", {user_id, salary, bank_detail, created_by: user_data.user_id }, (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      res.status(200).send({success: true,message: "SALARY Insert successfully",data: result,});
  } 
  catch (error)
  {
      res.status(400).send({success: false,message: "SALARY Insert failed",data: error.message,});
  }
};





// UPDATE SALARY
// exports.updatesalary = (req,res) => {
// 	console.log(req.body);
// 	const sid = req.params.salary_id;
//     const uid = req.body.user_id;
// 	const salary = req.body.salary;
// 	const bankdetail = req.body.bank_detail;
    
// 	con.query('UPDATE salary SET user_id = ?, salary = ?, bank_detail = ? WHERE salary_id = ? ',[ uid, salary ,bankdetail,sid],(err,result,response)=>{
//         if(err)
//         {
//             res.status(400).send({success : false, message: "SALARY update failed",data: response});
//         }
//         else
//         {
//             res.status(200).send({success : true, message: "SALARY update successfully",data: response});
//         }
//     });
// }


exports.updatesalary = async (req, res) => {
  try {
    const salary_id = req.params.salary_id;
      const { user_id, salary, bank_detail} = req.body;

      const detailExists = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS count FROM salary WHERE bank_detail = ?", [bank_detail], (err, result) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
      // state already use
      if (detailExists.count > 0) {
          res.status(400).send({success: false,message: "SALARY is already being used",data: null,});
          return;
      }
      const result = await new Promise((resolve, reject) => {
      con.query('UPDATE salary SET user_id = ?,salary = ?,bank_detail  = ? WHERE salary_id = ?',[user_id, salary, bank_detail, salary_id],
              (err, result) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(result);
                  }
              },
          );
      });
      res.status(200).send({success: true,message: "SALARY Update successfully",data: result,});
  } 
  catch (error) 
  {
      res.status(400).send({success: false,message: "SALARY Update failed",data: error.message,});
  }
};




//DELETE SALARY
exports.deletesalary = (req,res) => {
	con.query('DELETE FROM salary WHERE salary_id =?',[req.params.salary_id], (err, rows, response) => {
        if(err)
        {
            //console.log(rows);
			res.status(400).send({success : false, message: "SALARY delete failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "SALARY delete successfully",data: response});
        }
    })
}



// FIND BY USER
exports.findbyuser = (req,res) =>{
	console.log(req.params);

	con.query(`SELECT salary.*, user.username, user.firstname AS created_by FROM salary
    LEFT JOIN user ON salary.user_id = user.user_id 
    WHERE user.user_id = ?`,[req.params.user_id], (err, rows, fields,response) => {
        if(err)
        {
            //console.log(rows);
		    res.status(400).send({success : false, message: "SALARY find failed",data: response});
        }
        else
        {
			res.status(200).send({success : true, message: "SALARY find successfully", data: rows});
        }
    });
};




// GET ( LOG-IN USER VIEW SALARY )
exports.loginusersalary = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    con.query(`SELECT salary.*, user.firstname, user.firstname AS created_by  FROM salary 
    LEFT JOIN user ON salary.user_id = user.user_id
    LEFT JOIN user AS created_by ON salary.created_by = created_by.user_id
    WHERE user.user_id  = ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).json({success:false, message: 'Error retrieving SALARY' });
      }
  
      const salary = results;
      req.salary = salary;
      console.log("userId",userId)
      // do something with the attendance records
      res.status(200).json({success:true, message: 'SALARY find successfully', data:salary });
    });
};






//SALARY COUNTATION

{  // WORKING
// exports.countsalary = (req, res) => {
//   // Extract the user ID, month, and year from the request parameters
//   const user_id = req.params.user_id;
//   const month = parseInt(req.query.month);
//   const year = parseInt(req.query.year);

//   // Query the database to get the salary for the specified user, month, and year
//   con.query(`SELECT salary, created_at FROM salary WHERE user_id = ?`,[user_id], (err, rows) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send({success: false, message: "Failed to find salary", data: err});
//       }
//       else {
//         if (rows.length > 0) {
//           const salary = rows[0].salary;

//           // Filter the salaries based on the specified month and year
//           const filteredSalaries = rows.filter(row => new Date(row.created_at).getFullYear() === year && new Date(row.created_at).getMonth() === month - 1);

//           if (filteredSalaries.length > 0) {
//             const totalSalary = filteredSalaries.reduce((sum, row) => sum + row.salary, 0);
//             const totalDaysInMonth = new Date(year, month, 0).getDate();
//             const perDayAmount = totalSalary / totalDaysInMonth;

//             // Retrieve PF and professional tax rates from the setting table
//             con.query(`SELECT rate FROM setting WHERE type = 'PF'`, (err, rows) => {
//               if (err) {
//                 console.log(err);
//                 res.status(400).send({success: false, message: "Failed to retrieve PF rate from settings", data: err});
//               } else {
//                 const pfRate = parseFloat(rows[0].rate);
            
//                 // Retrieve professional tax rate from the setting table
//                 con.query(`SELECT rate FROM setting WHERE type = 'proftax'`, (err, rows) => {
//                   if (err) {
//                     console.log(err);
//                     res.status(400).send({success: false, message: "Failed to retrieve professional tax rate from settings", data: err});
//                   } else {
//                     const ptRate = parseFloat(rows[0].rate);
//                     const profDeduction = totalSalary - ptRate ;

//                 // Retrieve the number of paid leaves taken by the user in the specified month and year
//                 con.query('SELECT SUM(days) as num_leaves FROM `leave` WHERE user_id = ? AND leave_type = \'paid leave\' AND status = \'Accept\' AND YEAR(start_date) = ? AND MONTH(start_date) = ?', [user_id, year, month], (err, rows) => {
//                   if (err) {
//                     console.log(err);
//                     res.status(400).send({success: false, message: "Failed to retrieve paid leaves taken by user", data: err});
//                   } else {
//                     const numLeaves = rows[0].num_leaves;
//                     const leaveDeduction = numLeaves * perDayAmount;
                
//                     // Check if salary is above 15000
//                     if (totalSalary > 15000) {
//                       //const ptRate = parseFloat(rows[0].rate);
//                       const pfDeduction = totalSalary > 15000 ? totalSalary * pfRate / 100 : 0;
//                       const profDeduction = totalSalary - ptRate ;
//                       const netSalary = totalSalary - pfDeduction - ptRate - leaveDeduction;

//                       let result = {
//                         total_salary: totalSalary,
//                         basic_salary : totalSalary / 2,
//                         HRA : totalSalary * 0.20,
//                         Special_allowance : totalSalary * 0.30,
//                         PF : pfDeduction,
//                         PROFtax : ptRate,
//                         paid_leave_count: numLeaves,
//                         leave_deduction: leaveDeduction,
//                         net_salary: netSalary,
//                         per_day_amount: perDayAmount
//                       };
//                       res.status(200).send({success: true, message: "Successfully calculated salary for the specified month and year", data: result});
//                     }
//                     else {
//                       const netSalary = totalSalary;
                
//                       let result = {
//                         total_salary: totalSalary,
//                         basic_salary : totalSalary / 2,
//                         HRA : totalSalary * 0.20,
//                         Special_allowance : totalSalary * 0.30,
//                         PF : 0,
//                         PROFtax : profDeduction,
//                         paid_leave_count: numLeaves,
//                         net_salary: netSalary,
//                         per_day_amount: perDayAmount
//                       };
//                         res.status(200).send({success: true, message: "Successfully calculated salary for the specified month and year", data: result});
//                     }
//                   }
//                 });
//               }
//             })
//           }
//         })
//       }
//       else{
//         res.status(400).send({success: false, message: "No salary found for the given user", data: null});
//       }
//     }
//   }
// })
// }
}


exports.countsalary = (req, res) => {
  // Extract the user ID, month, and year from the request parameters
  const user_id = req.params.user_id;
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  // Query the database to get the salary for the specified user, month, and year
  con.query(`SELECT salary, created_at FROM salary WHERE user_id = ?`, [user_id], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).send({ success: false, message: "Failed to find salary", data: err });
    } else {
      if (rows.length > 0) {
        const salary = rows[0].salary;

        // Filter the salaries based on the specified month and year
        const filteredSalaries = rows.filter(row => new Date(row.created_at).getFullYear() === year && new Date(row.created_at).getMonth() === month - 1);

        if (filteredSalaries.length > 0) {
          const totalSalary = filteredSalaries.reduce((sum, row) => sum + row.salary, 0);
          const totalDaysInMonth = new Date(year, month, 0).getDate();
          const perDayAmount = totalSalary / totalDaysInMonth;

          // Retrieve PF rate from the setting table
          con.query(`SELECT rate FROM setting WHERE type = 'PF'`, (err, rows) => {
            if (err) {
              console.log(err);
              res.status(400).send({ success: false, message: "Failed to retrieve PF rate from settings", data: err });
            } else {
              const pfRate = parseFloat(rows[0].rate);

              // Retrieve professional tax rate from the setting table
              con.query(`SELECT rate FROM setting WHERE type = 'proftax'`, (err, rows) => {
                if (err) {
                  console.log(err);
                  res.status(400).send({ success: false, message: "Failed to retrieve professional tax rate from settings", data: err });
                } else {
                  const ptRate = parseFloat(rows[0].rate);

                  // Retrieve TDS rates from the setting table
                  con.query(`SELECT salary_range_start, salary_range_end, deduction_rate FROM tds`, (err, rows) => {
                    if (err) {
                      console.log(err);
                      res.status(400).send({ success: false, message: "Failed to retrieve deduction_rate from TDS", data: err });
                    } else {
                      const tdsRates = rows;
                  
                      // Find the applicable TDS rate based on the user's total salary
                      let tdsRate = 0;
                      for (let i = 0; i < tdsRates.length; i++) {
                        const { salary_range_start, salary_range_end, deduction_rate } = tdsRates[i];
                        if (totalSalary >= salary_range_start && totalSalary <= salary_range_end) {
                          tdsRate = parseFloat(deduction_rate);
                          console.log(tdsRate); // Log the tdsRate
                          break;
                        }
                      }
                  
                      // Retrieve the number of paid leaves taken by the user in the specified month and year
                      con.query('SELECT SUM(days) as num_leaves FROM `leave` WHERE user_id = ? AND leave_type = \'paid leave\' AND status = \'Accept\' AND YEAR(start_date) = ? AND MONTH(start_date) = ?', [user_id, year, month], (err, rows) => {
                        if (err) {
                          console.log(err);
                          res.status(400).send({ success: false, message: "Failed to retrieve paid leaves taken by user", data: err });
                        } else {
                          const numLeaves = rows[0].num_leaves;
                          const leaveDeduction = numLeaves * perDayAmount;
                  
                          // Calculate the tdsAmount based on the totalSalary and tdsRate
                          const tdsAmount = (totalSalary * tdsRate) / 100;
                  
                          // Check if salary is above 15000
                          if (totalSalary > 15000) {
                            const pfDeduction = totalSalary * pfRate / 100;
                            const profDeduction = totalSalary - ptRate;
                            const netSalary = totalSalary - pfDeduction - ptRate - leaveDeduction;
                  
                            let result = {
                              total_salary: totalSalary,
                              basic_salary: totalSalary / 2,
                              HRA: totalSalary * 0.20,
                              Special_allowance: totalSalary * 0.30,
                              PF: pfDeduction,
                              PROFtax: ptRate,
                              TdsRate: tdsAmount,
                              paid_leave_count: numLeaves,
                              leave_deduction: leaveDeduction,
                              net_salary: netSalary,
                              per_day_amount: perDayAmount
                            };
                            res.status(200).send({ success: true, message: "Successfully calculated salary for the specified month and year", data: result });
                          } else {
                            const netSalary = totalSalary;
                  
                            let result = {
                              total_salary: totalSalary,
                              basic_salary: totalSalary / 2,
                              HRA: totalSalary * 0.20,
                              Special_allowance: totalSalary * 0.30,
                              PF: 0,
                              PROFtax: profDeduction,
                              TDSrate: tdsAmount,
                              paid_leave_count: numLeaves,
                              net_salary: netSalary,
                              per_day_amount: perDayAmount
                            };
                            res.status(200).send({ success: true, message: "Successfully calculated salary for the specified month and year", data: result });
                          }
                        }
                      });
                    }
                  })
                }
              })
            }
          })
        }
        else{
          res.status(400).send({success: false, message: "No salary found for the given user", data: null});
        }
      }
    }
  })
}

