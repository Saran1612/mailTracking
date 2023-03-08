var mysql = require("mysql2");

const pool = mysql.createPool({
  host: "emailtracking.cdqjtuktl4ej.ap-northeast-1.rds.amazonaws.com",
  user: "admin",
  password: "Poojary123",
  port: "3306",
});


module.exports = pool.promise();