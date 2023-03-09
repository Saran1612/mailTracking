const moment = require("moment");
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const MailSender = async(res,MysqlQueryExecute) => {



    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'abhishek.poojary@absyz.com',
    //       pass: 'SarojaDevi123@'
    //     }
    //   });


      var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
      secure: false,
       auth: {
      user: 'abhishekpoojary13@gmail.com',
      pass: 'ghpetgdryokgkhzw'
  }
}));

      var mailOptions = {
        from: 'abhishekpoojary13@gmail.com',
        to: 'abhishek.poojary@absyz.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      


//     let todaysDate = moment().format('YYYY-MM-DD');
//     let nextDate = moment(todaysDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
//     console.log(nextDate,"Todays date");
//     let AddedUserId = await MysqlQueryExecute(`
//     SELECT * FROM Email_Tracking.TimeStamp LEFT JOIN Email_Tracking.MAIL_USER ON Email_Tracking.TimeStamp.user_id = Email_Tracking.MAIL_USER.ID  
//     WHERE User_TimeStamp >= '${todaysDate}' 
//     AND User_TimeStamp <= '${nextDate}'
//    `);
//     console.log(AddedUserId,"Check with added user");

    res.send({ title: 'GeeksforGeeks' });
console.log("Called");

}

module.exports = {MailSender}
