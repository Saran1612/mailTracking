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
  // const userEmail = req.get('X-User-Email');
  // console.log(userEmail, "UserMail check");
  const current_time = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");
  // console.log(current_time,"Check current date and time")

  var fileName = "rect.png";
  const timestamp = new Date().getTime();
  // console.log("Opened At", timestamp);
  let email = req.query.email;
  let UID = req.query.msgId;
  let subject = req.query.subject;
  let recipents = req.query.recipient;
  const uniqueId = req.query.uniqueId;
  const recipientId = req.query.recipientId;
  let senderEmail = req.headers;
  // console.log(senderEmail,"senderEmail");

  console.log(email, "email");
  // console.log(req, "URL");
  // console.log(res, "response");

  // console.log(UID, "uid");
  let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = "${UID}" and USER_NAME = "${email}"`;
  let FinalCount = await MysqlQueryExecute(countQuery);
  // console.log(FinalCount, "message count");
  if (FinalCount[0].MESSAGECount !== 0) {
    let IncrmentQuery = `UPDATE Email_Tracking.MAIL_USER SET Count = Count+1 WHERE UQ_ID = "${UID}" and USER_NAME = "${email}"`;
    let UserDataQuery = `Select ID as USERID from Email_Tracking.MAIL_USER where UQ_ID = "${UID}" and USER_NAME = "${email}"`;

    let FinalResult = await MysqlQueryExecute(IncrmentQuery);
    // console.log(FinalResult,"Check Final Count");
    let UserData = await MysqlQueryExecute(UserDataQuery);
    // console.log(UserData[0].USERID,"Check User Data");
    if (UserData[0].USERID) {
      let InsertTime = await MysqlQueryExecute(
        `update  Email_Tracking.TimeStamp set User_TimeStamp='${current_time}' where user_id = ${UserData[0].USERID}`
      );
    }
  } else {
    // console.log(subject,`INSERT INTO Email_Tracking.MAIL_USER(USER_NAME, UQ_ID,Mail_Subject, COUNT) VALUES("${email}","${UID}","${subject}",1)`,"Test subject");
    let AddedUser = await MysqlQueryExecute(
      `INSERT INTO Email_Tracking.MAIL_USER(USER_NAME, UQ_ID,Mail_Subject, COUNT) VALUES("${email}","${UID}","${subject}",1)`
    );

    let AddedUserId = await MysqlQueryExecute(
      `Select ID as UserId from Email_Tracking.MAIL_USER where USER_NAME="${email}" and UQ_ID = "${UID}"`
    );
    // console.log(AddedUserId, "Added userId");
    if (AddedUserId.length > 0) {
      const current_time = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
      // console.log(current_time,"Check current date and time")
      let AddedTimeStamp = await MysqlQueryExecute(
        `INSERT INTO Email_Tracking.TimeStamp(User_TimeStamp, user_id) VALUES('${current_time}', ${AddedUserId[0].UserId})`
      );
    }
    // }
  }
  res.set("Content-Type", "image/png");
  // Set the cache control headers to prevent caching
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.sendFile(fileName, options, function async(err) {
    if (err) {
      // next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });

  

});

app.get("/trackLink", async (req, res) => {
  let url = req.query.url;
  let email = req.query.email;
  console.log(email, "Check email");
  console.log(url[1], "Check url");
  if(url){
  res.redirect(url[1]);
  }
})

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
