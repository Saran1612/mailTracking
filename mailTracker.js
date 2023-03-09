const express = require("express");
const path = require("path");
const app = express();
var moment = require("moment");
const PORT = process.env.PORT || 3080;
const db = require("./connection");

// let sql = `INSERT INTO Email_Tracking.MAIL_USER(USER_NAME,UQ_ID)
//            VALUES('Test 2',4)`;
// let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = 1`;
async function MysqlQueryExecute(query1) {
  let finalresult = [];
  const [result] = await db.execute(query1);
  // console.log(JSON.stringify(result), "final result");
  // await db.execute(query1, async function (err, result) {
  // if (err) throw err;
  // else {
  //   console.log(JSON.stringify(result), "Query check final");
  //   finalresult.push(result);
  //   return finalresult;
  //   console.log(result, "Final Result");
  // }
  // });
  //  console.log(data.data,"Data check")
  // return finalresult;
  // db.end();
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
  console.log(req.query);
  console.log(email, "email");
  console.log(UID, "uid");
  let countQuery = `SELECT COUNT(UQ_ID) AS MESSAGECount FROM Email_Tracking.MAIL_USER WHERE UQ_ID = 1 and USER_NAME = "TEST"`;
  let FinalCount = await MysqlQueryExecute(countQuery);
  // console.log(FinalCount, "message count");
  if (FinalCount.MESSAGECount !== 0) {
    let IncrmentQuery = `UPDATE Email_Tracking.MAIL_USER SET Count = 1 WHERE UQ_ID = 1 and USER_NAME = "TEST"`;
    let FinalResult = await MysqlQueryExecute(IncrmentQuery);
    // console.log(FinalResult, "Updated count");
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
