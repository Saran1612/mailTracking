const express = require("express");
var mysql = require('mysql');
const path = require("path");
const app = express();
var moment = require('moment');
const PORT = process.env.PORT || 3080;


app.get("/", (req, res) => {
  var options = {
    root: path.join(__dirname),
  };

  var fileName = "rect.png";
  
  res.sendFile(fileName, options, function (err) {
    if (err) {
      // next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });

  const timestamp = new Date();
  // console.log(timestamp, "time");
  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
  let email = req.query.email;
  let UID = req.query.msgId;
  console.log(email,"email");
  console.log(req.query,"uid");

});

app.get("/test", (req, res, next) => {
  res.send("Testing");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password@123",
  database: 'your_database_name',
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
