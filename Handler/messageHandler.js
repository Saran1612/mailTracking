
const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const moment = require("moment");
const path = require("path");

const GetMessageHandler = async (req, res, next) => {
   const MessageDate = req.query.date;
   const MessageData = await MysqlQueryExecute(`
SELECT * FROM absyz_email_track.Mail_Message
 WHERE DATE(Sent_Time) = '${MessageDate}'`
   )
   console.log(MessageData, "Gmail message")
   res.send(MessageData);
};

module.exports = GetMessageHandler;
