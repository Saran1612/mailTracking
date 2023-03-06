const express = require("express");
var mysql = require('mysql');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3080;


app.get("/", (req, res) => {
  var options = {
    root: path.join(__dirname),
  };

  var fileName = "rect.png";
  const timestamp = new Date();
  console.log(timestamp, "time");
  res.sendFile(fileName, options, function (err) {
    if (err) {
      // next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });

  let email = req.query.email;
  let UID = req.query.msgId;
  console.log(email,"email");
  console.log(UID,"uid");

});

app.get("/test", (req, res, next) => {
  res.send("Testing");
});

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Password@123"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
