var con = require('../../config/hrmsconfig.js');
const dateTime = require('date-and-time');
const jwt = require('jsonwebtoken');
var transporter = require('../../config/nodemailer.js');
const moment = require('moment')



exports.allinterndailyattendancetotal = (req, res) => {
  const query = `SELECT user_id FROM user WHERE role_id = 4`;
  con.query(query, async (err, rows, response) => {
    for (let i = 0; i < rows.length; i++) {
      console.log(rows[i].user_id); // log user_id to console

      let user_id = rows[i].user_id;
      let searchDate = new Date(); // default to current date
      if (req.query.date) {
        searchDate = new Date(req.query.date);
      }
      if (err) {
        res.status(400).send({ success: false, message: "REPORTING find failed", data: response });
      } else {
        const emailList = await new Promise((resolve, reject) => {
          con.query('SELECT official_email FROM user WHERE role_id = ?', [4], (err, result) => {
            if (err) {
              reject(err);
            } else {
              const emailList = result.map(user => user.official_email);
              resolve(emailList);
            }
          });
        });

        if (emailList.length === 0) {
          res.status(404).send({ success: false, message: "No email addresses found for interns", data: [] });
          return;
        }
        const year = searchDate.getFullYear();
        const month = searchDate.getMonth() + 1;
        const day = searchDate.getDate();
        const intime = `${year}-${month}-${day}`;

        const query = `SELECT u.user_id, u.firstname, MIN(a.intime) AS first_checkin, MAX(a.outtime) AS last_checkout,(SELECT COUNT(*) FROM reporting WHERE user_id = ?) AS assign_id_count
              FROM user u
              LEFT JOIN attendance a ON u.user_id = a.user_id AND DATE(a.intime) = ?
              WHERE u.user_id IN (SELECT assign_id FROM reporting WHERE user_id = ?)
              GROUP BY u.user_id`;

        con.query(query, [user_id, intime, user_id], async (err, rows) => {
          const present_users = rows.filter(row => row.first_checkin && row.last_checkout);
          const present_employee_count = present_users.length;
          const absent_employee_count = rows.length - present_employee_count;

          if (rows.length === 0) {
            res.status(404).send({ success: false, message: "No attendance records found for the specified date", data: [] });
          } 
          else {
            const present_user_working_hours = [];
            for (let j = 0; j < present_users.length; j++) {
              const start = present_users[j].first_checkin;
              const end = present_users[j].last_checkout;
              const diffInMs = end - start;
              const diffInHours = diffInMs / (1000 * 60 * 60);
              present_user_working_hours.push(diffInHours);
            }
            const total_working_hours = present_user_working_hours.reduce((a, b) => a + b, 0);
            let average_working_hours = 0;
            if (total_working_hours > 0) {
              average_working_hours = total_working_hours / present_employee_count;
            } else {

            }
           //console.log(rows[i].user_id); // log user_id to console
            console.log(emailList[i]); // log email to console

            if (emailList[i]) {
              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: emailList[i],
                subject: 'New ATTENDANCE REPORT',
                html: `
                <html>
                  <head>
                    <style>             
                        .image{
                          text-align:center;
                        }
                        .image img{
                          width:100px;
                          text-align:center;
                        }
                        .atten {
                            display: flex;
                            width:50%;
                        }

                        .digit {
                          font-size: 40px;
                          text-align:center;
                          margin:0
                        }

                        .green {
                          color: green;
                        }
                        .red {
                          color: red;
                        }
                        .heading{
                              text-transform: capitalize;
                              font-size:22px;
                              text-align:center;
                        }
                        @media (min-width: 320px) and (max-width: 556px){
                          .heading{
                            font-size:16px
                          }
                          .atten{
                            width:100%;
                          }
                        }
                    </style>
                    <body>
                      <p>Hello MANAGER,</p>
                             <p>Here is your team's attendance report for today.</p>
                             <p>Attendance Details:</p>
                      <div class='atten'>
                            <div style='width:100%'>
                              <div class='image'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTu5qQXNTitvIcqSJkDuuB2MGXtPkACwPR7rwI2kGYDvBfZQl8DCKWvpl8ggru8MhqfEyEvngRwrA&usqp=CAU&ec=48600113" alt="Image">
                                <p class="digit">${rows.length}</p>
                                <p class='heading'>total employees </p>
                              </div>
                              <div class='image'>
                                <img src="https://icons.veryicon.com/png/o/application/app-5/attendance-4.png" alt="image"/>
                                <p class="digit green">${present_employee_count}</p>
                                <p class='heading'>employees present</p>
                              </div>
                           </div>
                            <div style='width:100%'>
                                <div class='image'>
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF6DU6SxQsKPytOtPufGq2g21FKj-eWWMzbc_6UBYQK7ZQf7u--neWaGIMpWPF_ON6cyK1ZMAPpHU&usqp=CAU&ec=48665701" alt="image"/>
                                  <p class="digit red">${absent_employee_count}</p>
                                   <p class='heading'> employees absent</p>
                                </div>
                                <div class='image'>
                                  <img src="https://static.vecteezy.com/system/resources/previews/002/103/877/original/time-tracking-color-icon-vector.jpg" alt="image"/>
                                  <p class="digit">${average_working_hours}</p>
                                  <p class='heading'>average working hours </p>
                                </div>
                            </div>
                      </div>
                          
                    </body>
                  </head>
                </html>`
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log('email sent:' + info.response);
                  res.status(200).send({ status: true, message: "Find All Reporting Successfully" });
                }
              });
            }
          }
          // res.status(200).send({ status: true, message: "Find All Reporting Successfully" });
        });
      }
    }
  })
};
