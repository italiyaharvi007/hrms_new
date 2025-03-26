{ // SIMPLE AUTH
  
  // const jwt = require('jsonwebtoken');
// const { authcontroller } = require('../controller/authcontroller.js');
// require('dotenv').config();

// module.exports =  (req, res, next) => {
    
//   let token = req.headers.authorization;
//     if (token && token.startsWith('Bearer ')) 
//     {
//       token = token.slice(7, token.length);
//     }
  
//     if (!token) 
//     {
//       return res.status(400).send({message: "No TOKEN provided!"});
//     }
//     jwt.verify(token, process.env.JWT_SECRET, {expiresIn: '24h'},(err, decoded) => {
//       if (err) 
//       {
//         console.log(err);
//         return res.status(400).send({message: err.message});
//       }
//       req.admin_id = decoded.id;
//       next();
//     });
//   };
}



// const { query } = require('express');
// const jwt = require('jsonwebtoken');
// var con = require('../../config/hrmsconfig.js');
// require('dotenv').config();

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, decoded) => {
//     console.log("decoded",decoded)
//     if (err) {
//       console.error(err);
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     const userId = decoded.userId;
//         console.log("userId",userId)

//      con.query(`SELECT user.*,DATE_FORMAT(user.birth_date,'%d/%m/%Y') AS birth_date, city.city_name, role.role_name, created_by_user.firstname AS created_by 
//       FROM user
//       LEFT JOIN city ON user.city_id = city.city_id
//       LEFT JOIN role ON user.role_id = role.role_id 
//       LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id
//       WHERE user.user_id= ` + userId, (err, results) => {

//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Error retrieving user' });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       const user = results[0];
//       req.user = user;
//       next();
//    });
//     console.log( query.sql);
//   });
// };


const jwt = require('jsonwebtoken');
const con = require('../../config/hrmsconfig.js');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    con.query(`SELECT user.*,DATE_FORMAT(user.birth_date,'%d/%m/%Y') AS birth_date, city.city_name, role.role_name, created_by_user.firstname AS created_by 
      FROM user
      LEFT JOIN city ON user.city_id = city.city_id
      LEFT JOIN role ON user.role_id = role.role_id 
      LEFT JOIN user AS created_by_user ON user.created_by = created_by_user.user_id
      WHERE user.user_id= ${userId}`, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error retrieving user' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = results[0];
      req.user = user;
      next();
    });
  });
};
