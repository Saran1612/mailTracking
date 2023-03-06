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
      // console.log("Sent:", fileName);
    }
  });

  const timestamp = new Date().getTime();
  console.log("Opened At",timestamp);
  console.log(req,"response");
  let email = req.query.email;
  let UID = req.query.msgId;
  console.log(email,"email");
  console.log(UID,"uid");

});

app.get("/test", (req, res, next) => {
  res.send("Testing");
});

app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});
