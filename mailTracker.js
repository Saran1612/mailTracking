const express = require("express");
const path = require("path");
const app = express();
var moment = require("moment");
const PORT = process.env.PORT || 3080;
const db = require("./connection");
app.use(express.json());





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
  const current_time = moment().format("YYYY-MM-DD HH:SS:MM")
console.log(current_time,"Check current date and time")

  var fileName = "rect.png";
  const timestamp = new Date().getTime();
  console.log("Opened At", timestamp);
  let email = req.query.email;
  let UID = req.query.msgId;
  let subject = req.query.subject;
  // console.log(req.query);
  console.log(subject, "subject");
  console.log(email, "email");
  console.log(UID, "uid");
  let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = ${UID} and USER_NAME = ${email}`;
  let FinalCount = await MysqlQueryExecute(countQuery);
  console.log(FinalCount, "message count");
  if (FinalCount[0].MESSAGECount !== 0) {
    let IncrmentQuery = `UPDATE Email_Tracking.MAIL_USER SET Count = Count+1 WHERE UQ_ID = ${UID} and USER_NAME = ${email}`;
    let UserDataQuery = `Select ID as USERID from Email_Tracking.MAIL_USER where UQ_ID = ${UID} and USER_NAME = ${email} `;

    
    let FinalResult = await MysqlQueryExecute(IncrmentQuery);
    console.log(FinalResult,"Check Final Count");
    let UserData = await MysqlQueryExecute(UserDataQuery);
    console.log(UserData[0].USERID,"Check User Data");
    if(UserData[0].USERID){
      let InsertTime = await MysqlQueryExecute(`update  Email_Tracking.TimeStamp set User_TimeStamp='${current_time}' where user_id = ${UserData[0].USERID}`);

    }

  }else{
    let AddedUser = await MysqlQueryExecute(`INSERT INTO Email_Tracking.MAIL_USER(USER_NAME, UQ_ID, COUNT) VALUES(${email},${UID},1)`);

    let AddedUserId = await MysqlQueryExecute(`Select ID as UserId from Email_Tracking.MAIL_USER where USER_NAME=${email} and UQ_ID = ${UID}`);
    console.log(AddedUserId, "Added userId");
    if(AddedUserId.length > 0){
        const current_time = moment().format("YYYY-MM-DD HH:SS:MM")
    console.log(current_time,"Check current date and time 2")
    let AddedTimeStamp = await MysqlQueryExecute(`INSERT INTO Email_Tracking.TimeStamp(User_TimeStamp, user_id) VALUES('${current_time}', ${AddedUserId[0].UserId})`)
    }
    // }
  }
  res.sendFile(fileName, options, function async(err) {
    if (err) {
      // next(err);
    } else {
      // console.log("Sent:", fileName);
    }
  });
});

app.get("/test", (req, res, next) => {
  res.send("Testing");
});



app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
