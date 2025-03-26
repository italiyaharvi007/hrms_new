var con = require('../../config/hrmsconfig.js');


// FIND ALL COMPANY-PROFILE
exports.findallcompnayprofile = async (req, res)=> {
    try {
      const { company_id} = req.params;
  
      const result = await new Promise((resolve, reject) => {
        con.query(`SELECT company_profile.*, city.city_name,  created_by.firstname AS created_by FROM company_profile
        LEFT JOIN city ON company_profile.city_id = city.city_id
        LEFT JOIN user AS created_by ON city.created_by = created_by.user_id
        WHERE company_profile.company_id `, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      res.status(200).send({ success: true, message: "COMPANY-PROFILE Find successfully", data: result, });
    }
    catch (error) {
      res.status(400).send({ success: false, message: "COMPANY-PROFILE Find failed", data: error.message, });
    }
  }
  
  



//FIND ONE COMPANY-PROFILE
exports.findonecompnayprofile = async (req, res)=> {
  console.log(req.params);

  con.query(`SELECT company_profile.*, city.city_name AS city_name FROM company_profile 
  LEFT JOIN city ON company_profile.city_id
  WHERE company_profile.company_id   = ? LIMIT 1`, [req.params.company_id], (err, rows, fields, response) => {
      console.log('SQL Query:', this.sql); // add this line to log the SQL query being executed
      if (err) {
        console.log(rows);
        res.status(400).send({ success: false, message: "COMPANY-PROFILE find failed", data: response });
      }
      else 
      {
        let single = (rows.length > 0) ? rows[0] : [];
          res.status(200).send({status:true,message:"Find One COMPANY-PROFILE Successfully",data:single});
      }
    });
}





//Insert Compnay_profile
// exports.addcompanyprofile = async (req, res) => {
//     try {   
//       const { company_name,domain_name,website,city_id,address,company_policy,moonlight_policy,tour_policy,yearlyleave_policy } = req.body;
  
//       const result = await new Promise((resolve, reject) => {
//         con.query("INSERT INTO company_profile SET ?", { company_name,domain_name,website,city_id,address,company_policy,moonlight_policy,tour_policy,yearlyleave_policy}, (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//       });
//       res.status(200).send({ success: true, message: "COMPANY-PROFILE insert successfully", data: result, });
//     }
//     catch (error) {
//       res.status(400).send({ success: false, message: "COMPANY-PROFILE insert failed", data: error.message, });
//     }
//   };


{
// exports.addcompanyprofile = async (req, res) => {
//   let user_data = req.user;
//   console.log(req.file);
//   try {
//     const {  company_name,domain_name,website,city_id,address,company_policy,moonlight_policy,tour_policy,yearlyleave_policy} = req.body;
//     const { filename: pdf } = req.file;

//     if (!pdf) {
//       return res.status(400).json({ message: 'pdf file not found' });
//     }
//     const company_profile = {
//       company_name: company_name,
//       domain_name: domain_name,
//       website: website,
//       city_id: city_id,
//       address: address,
//       company_policy: company_policy,
//       moonlight_policy: moonlight_policy,
//       tour_policy: tour_policy,
//       yearlyleave_policy: yearlyleave_policy
//       };
//     // Insert the user data with the hashed password
//     con.query('INSERT INTO company_profile SET ?', company_profile, (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(400).json({ message: 'Internal server error' });
//       }

//       res.status(200).json({ message: 'company_profile Insert successfully', data: results });
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Internal server error' });
//   }
// };
}




//Insert Compnay_profile
exports.addcompanyprofile = async (req, res) => {
  try {
    const { company_name, domain_name, website, city_id, address } = req.body;
    const {image, company_policy, moonlight_policy, tour_policy, yearlyleave_policy } = req.files;

    const imagePath = `${image[0].filename}`;

    const result = await new Promise((resolve, reject) => {
      con.query("INSERT INTO company_profile SET ?", { image: imagePath, company_name, domain_name, website, city_id, address,company_policy: company_policy[0].filename, moonlight_policy: moonlight_policy[0].filename, tour_policy: tour_policy[0].filename, yearlyleave_policy: yearlyleave_policy[0].filename }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).send({ success: true, message: "COMPANY_PROFILE inserted successfully", data: {image, company_name, domain_name, website, city_id, address, company_policy: company_policy[0].filename, moonlight_policy: moonlight_policy[0].filename, tour_policy: tour_policy[0].filename, yearlyleave_policy: yearlyleave_policy[0].filename }, other: result });

  } catch (error) {
    res.status(400).send({ success: false, message: "COMPANY_PROFILE insert failed", data: error.message });
  }
};





//Update company_profile 
exports.updatecompanyprofile = async (req, res) => {
  try {
    const { company_id  } = req.params;
    const { company_name, domain_name, website, city_id, address } = req.body;
    const {image, company_policy, moonlight_policy, tour_policy, yearlyleave_policy } = req.files;
    
    const result = await new Promise((resolve, reject) => {
      con.query(
        "UPDATE company_profile SET image=?,company_name=?, domain_name=?, website=?, city_id=?, address=?, company_policy=?, moonlight_policy=?, tour_policy=?, yearlyleave_policy=? WHERE company_id =?",
        [
          company_name,
          domain_name,
          website,
          city_id,
          address,
          image ? image[0].path : null,
          company_policy ? company_policy[0].filename : null,
          moonlight_policy ? moonlight_policy[0].filename : null,
          tour_policy ? tour_policy[0].filename : null,
          yearlyleave_policy ? yearlyleave_policy[0].filename : null,
          company_id 
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.status(200).send({
      success: true,
      message: "COMPANY_PROFILE updated successfully",
      data: {
        company_id ,
        company_name,
        domain_name,
        website,
        city_id,
        address,
        image : image ? image[0].path : null,
        company_policy: company_policy ? company_policy[0].filename : null,
        moonlight_policy: moonlight_policy ? moonlight_policy[0].filename : null,
        tour_policy: tour_policy ? tour_policy[0].filename : null,
        yearlyleave_policy: yearlyleave_policy ? yearlyleave_policy[0].filename : null
      },
      other: result
    });
  } catch (error) {
    res.status(400).send({success: false,message: "COMPANY_PROFILE update failed",data: error.message});
  }
};





//Update company_profile 
exports.updatecompanyprofile = async (req, res) => {
    try {
      const { company_id } = req.params;
      const { company_name, domain_name, website, city_id, address } = req.body;
      const { company_policy, moonlight_policy, tour_policy, yearlyleave_policy } = req.files;
  
      const result = await new Promise((resolve, reject) => {
        con.query(
          "UPDATE company_profile SET company_name=?, domain_name=?, website=?, city_id=?, address=?, company_policy=?, moonlight_policy=?, tour_policy=?, yearlyleave_policy=? WHERE company_id=?",
          [
            company_name,
            domain_name,
            website,
            city_id,
            address,
            company_policy ? company_policy[0].filename : null,
            moonlight_policy ? moonlight_policy[0].filename : null,
            tour_policy ? tour_policy[0].filename : null,
            yearlyleave_policy ? yearlyleave_policy[0].filename : null,
            company_id
          ],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
  
      res.status(200).send({success: true,message: "COMPANY-PROFILE updated successfully",
        data: {
          company_id,
          company_name,
          domain_name,
          website,
          city_id,
          address,
          company_policy: company_policy ? company_policy[0].filename : null,
          moonlight_policy: moonlight_policy ? moonlight_policy[0].filename : null,
          tour_policy: tour_policy ? tour_policy[0].filename : null,
          yearlyleave_policy: yearlyleave_policy ? yearlyleave_policy[0].filename : null
        },
        other: result
      });
    } catch (error) {
      res.status(400).send({success: false,message: "COMPANY-PROFILE update failed",data: error.message});
    }
  };






//Update company_profile 
  // exports.updatecompanyprofile = async (req, res) => {
  //   try {
  //     const company_id = req.params.company_id;
  //     const company_name = req.body.company_name;
  //     const domain_name = req.body.domain_name;
  //     const website = req.body.website;
  //     const city_id = req.body.city_id;
  //     const address = req.body.address;
  //     const company_policy = req.body.company_policy;
  //     const moonlight_policy = req.body.moonlight_policy;
  //     const tour_policy = req.body.tour_policy;
  //     const yearlyleave_policy = req.body.yearlyleave_policy;

  //     const result = await new Promise((resolve, reject) => {
  //       con.query('UPDATE company_profile SET company_name = ?, domain_name = ?,website = ?,city_id = ?,address = ?,company_policy = ?,moonlight_policy = ?,tour_policy = ?,yearlyleave_policy = ? WHERE company_id = ?',
  //        [company_name,domain_name,website,city_id,address,company_policy,moonlight_policy,tour_policy,yearlyleave_policy,company_id], (err, result) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         else {
  //           resolve(result);
  //         }
  //       }
  //       );
  //     });
  //     res.status(200).send({ success: true, message: 'COMPANY-PROFILE updated successfully', data: result });
  //   }
  //   catch (error) {
  //     res.status(400).send({ success: false, message: 'COMPANY-PROFILE update failed', data: error.message });
  //   }
  // };



//DELETE Company_Profile
exports.deletecompnayprofile = (req, res) => {
  con.query('DELETE FROM company_profile WHERE company_id  =?', [req.params.company_id  ], (err, rows, response) => {
    if (err) {
      //console.log(rows);
      res.status(400).send({ success: false, message: "COMPANY-PROFILE delete failed", data: response });
    }
    else {
      res.status(200).send({ success: true, message: "COMPANY-PROFILE delete successfully", data: response });
    }
  })
}