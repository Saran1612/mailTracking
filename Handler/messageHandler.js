
const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const moment = require("moment");
const path = require("path");

const GetMessageHandler = async (req, res, next) => {
   const MessageDate = req.query.date;
   const senderId = req.query.senderId;
   const MessageData = await MysqlQueryExecute(`
SELECT * FROM absyz_email_track.Mail_Message
left JOIN absyz_email_track.Sender ON absyz_email_track.Mail_Message.Sender_id = absyz_email_track.Sender.senderId
 WHERE absyz_email_track.Sender.senderId = ${senderId} and DATE(Sent_Time) = '${MessageDate}'`
   )
   console.log(MessageData, "Gmail message")
   res.send(MessageData);
};

module.exports = GetMessageHandler;
