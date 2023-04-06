const express = require("express");
const path = require("path");
const app = express();
// var moment = require("moment");
var moment = require("moment-timezone");
const PORT = process.env.PORT || 3080;
const db = require("./connection");
const MailHandler = require("./maildataHandler");
const fs = require("fs");
var cors = require("cors");
var bodyParser = require("body-parser");
// moment.tz.setDefault("Asia/Calcutta|Asia/Kolkata");
moment.tz.setDefault("Asia/Kolkata");

const current_time = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
console.log(current_time, "Check current date and time");

app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// Create a write stream to the log file
const logStream = fs.createWriteStream('/var/log/mailtrack.log', { flags: 'a' });

// Write a message to the log file
logStream.write('New log message\n');

// Close the log stream
logStream.end();

// let sql = `INSERT INTO Email_Tracking.MAIL_USER(USER_NAME,UQ_ID)
//            VALUES('Test 2',4)`;
// let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = 1`;
async function MysqlQueryExecute(query1) {
  let finalresult = [];
  const [result] = await db.execute(query1);
  return result;
}

app.get("/", async (req, res) => {
  var options = {
    root: path.join(__dirname),
  };
  // const current_time = moment()
  //   .tz("Asia/Kolkata")
  //   .format("YYYY-MM-DD HH:mm:ss");
  // // console.log(current_time,"Check current date and time")

  var fileName = "rect.png";
  // const timestamp = new Date().getTime();
  // // console.log("Opened At", timestamp);
  // let email = req.query.email;
  // let UID = req.query.msgId;
  // let subject = req.query.subject;
  // let recipents = req.query.recipient;
  // const uniqueId = req.query.uniqueId;
  // const recipientId = req.query.recipientId;
  // let senderEmail = req.headers;
  // // console.log(senderEmail,"senderEmail");

  // console.log(email, "email");
  // // console.log(req, "URL");
  // // console.log(res, "response");

  // // console.log(UID, "uid");
  // let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = "${UID}" and USER_NAME = "${email}"`;
  // let FinalCount = await MysqlQueryExecute(countQuery);
  // // console.log(FinalCount, "message count");
  // if (FinalCount[0].MESSAGECount !== 0) {
  //   let IncrmentQuery = `UPDATE Email_Tracking.MAIL_USER SET Count = Count+1 WHERE UQ_ID = "${UID}" and USER_NAME = "${email}"`;
  //   let UserDataQuery = `Select ID as USERID from Email_Tracking.MAIL_USER where UQ_ID = "${UID}" and USER_NAME = "${email}"`;

  //   let FinalResult = await MysqlQueryExecute(IncrmentQuery);
  //   // console.log(FinalResult,"Check Final Count");
  //   let UserData = await MysqlQueryExecute(UserDataQuery);
  //   // console.log(UserData[0].USERID,"Check User Data");
  //   if (UserData[0].USERID) {
  //     let InsertTime = await MysqlQueryExecute(
  //       `update  Email_Tracking.TimeStamp set User_TimeStamp='${current_time}' where user_id = ${UserData[0].USERID}`
  //     );
  //   }
  // } else {
  //   // console.log(subject,`INSERT INTO Email_Tracking.MAIL_USER(USER_NAME, UQ_ID,Mail_Subject, COUNT) VALUES("${email}","${UID}","${subject}",1)`,"Test subject");
  //   let AddedUser = await MysqlQueryExecute(
  //     `INSERT INTO Email_Tracking.MAIL_USER(USER_NAME, UQ_ID,Mail_Subject, COUNT) VALUES("${email}","${UID}","${subject}",1)`
  //   );

  //   let AddedUserId = await MysqlQueryExecute(
  //     `Select ID as UserId from Email_Tracking.MAIL_USER where USER_NAME="${email}" and UQ_ID = "${UID}"`
  //   );
  //   // console.log(AddedUserId, "Added userId");
  //   if (AddedUserId.length > 0) {
  //     const current_time = moment()
  //       .tz("Asia/Kolkata")
  //       .format("YYYY-MM-DD HH:mm:ss");
  //     // console.log(current_time,"Check current date and time")
  //     let AddedTimeStamp = await MysqlQueryExecute(
  //       `INSERT INTO Email_Tracking.TimeStamp(User_TimeStamp, user_id) VALUES('${current_time}', ${AddedUserId[0].UserId})`
  //     );
  //   }
  //   // }
  // }
  // res.set("Content-Type", "image/png");
  // // Set the cache control headers to prevent caching
  // res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  // res.set("Pragma", "no-cache");
  // res.set("Expires", "0");
  res.sendFile(fileName, options, function async(err) {
    if (err) {
      // next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });

  
fs.readFile('/var/log/mailtrack.log', 'utf-8', (err, data) => {
  if (err) {
    console.error(err, "error while reading the file");
    return;
  }

  // Parse the log file data
  const logs = data.split('\n');
  console.log(logs, "Check logs");

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const [ip, date, userAgent, email] = log.split(' ');

    // Do something with the IP, date, user-agent, and email
    console.log(`${email} opened the email on ${date} using ${userAgent}. IP: ${ip}`);
  }
});
});

app.get("/MailData", async (req, res, next) => {
  let Date = req.query.date;
  var new_date = moment(Date, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD");
  let AddedTimeStampData = await MysqlQueryExecute(`
  select * from Email_Tracking.TimeStamp INNER JOIN  Email_Tracking.MAIL_USER on Email_Tracking.TimeStamp.user_id = Email_Tracking.MAIL_USER.ID
  where Email_Tracking.TimeStamp.User_TimeStamp >= "${Date}" and Email_Tracking.TimeStamp.User_TimeStamp < "${new_date}"`);
  MailHandler.mailDataHandler(AddedTimeStampData, res, moment);
});

app.get("/script", (req, res) => {
  const script = '<script>alert("Hello, world!");</script>';
  res.send(script);
});

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
