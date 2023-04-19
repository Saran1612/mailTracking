const express = require("express");
const path = require("path");
const app = express();
// var moment = require("moment");
var moment = require("moment-timezone");
const PORT = process.env.PORT || 3080;
const db = require("./connection");
const MailHandler = require("./maildataHandler");
const MainRoute = require("./Router/index");
const fs = require("fs");
var cors = require("cors");
var bodyParser = require("body-parser");


app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/", MainRoute);


app.listen(PORT, function (err) {
  console.log(`server started on port ${PORT}`);
});



