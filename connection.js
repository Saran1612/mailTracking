var mysql = require("mysql2");

const pool = mysql.createPool({
  host: "ec2-3-82-89-135.compute-1.amazonaws.com",
  user: "root",
  password: "wUYWJhAufS5gkTJ",
  port: "3306",
});

// "EmailTracking1"


module.exports = pool.promise();