const express = require("express");
const path = require("path");
const app = express();
var moment = require("moment");
const PORT = process.env.PORT || 3080;
const db = require("./connection");
const MailSender = require("./mailSend");
app.use(express.json());


console.log(current_time,"Check current date and time")



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
  let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = 180 and USER_NAME = "TEST"`;
  let FinalCount = await MysqlQueryExecute(countQuery);
  console.log(FinalCount, "message count");
  if (FinalCount[0].MESSAGECount !== 0) {
    let IncrmentQuery = `UPDATE Email_Tracking.MAIL_USER SET Count = Count+1 WHERE UQ_ID = 1 and USER_NAME = "TEST"`;
    let UserDataQuery = `Select ID as USERID from Email_Tracking.MAIL_USER where UQ_ID = 1 and USER_NAME = "TEST" `;

    
    let FinalResult = await MysqlQueryExecute(IncrmentQuery);
    console.log(FinalResult,"Check Final Count");
    let UserData = await MysqlQueryExecute(UserDataQuery);
    // let InsertTime = await MysqlQueryExecute("INSERT INTO Email_Tracking.MAIL_USER")
    console.log(UserData[0].USERID,"Check User Data");
    if(UserData[0].USERID){
      let current_time = moment().format("YYYY-MM-DD HH:mm:ss");
      let InsertTime = await MysqlQueryExecute(`update  Email_Tracking.TimeStamp set User_TimeStamp='2023-03-08 12:40:48' where user_id = 1`);

    }

  }else{

    let AddedUserId = await MysqlQueryExecute(`Select ID as USERID from Email_Tracking.MAIL_USER where UQ_ID = 480 and USER_NAME = "abhishek.poojary14@absyz.com"`);
    console.log(AddedUserId,"Check with added user");
    if(AddedUserId.length > 0){
      console.log("Inside Add Time");
      let InsertTime = await MysqlQueryExecute(`Insert INTO Email_Tracking.TimeStamp(user_id) values(${AddedUserId[0].USERID})`);
      console.log(InsertTime,"Inserted Time")

    }
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

app.post("/sendmail",(req,res,next)=>{
  console.log("Inside sendmail")
  console.log(req.body,"Request body");
  
  // MailSender.MailSender(res,MysqlQueryExecute);
})

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
