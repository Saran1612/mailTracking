
const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const moment = require("moment");
const path = require("path");

const recipientDataHandler = async (req, res, next) => {
   const MessageKey = req.query.MessageKey;
   const MessageData = await MysqlQueryExecute(`SELECT 
   absyz_email_track.Recipient_Details.*,
  absyz_email_track.Mail_Message.*,
  absyz_email_track.Tracker.*,
   COUNT(absyz_email_track.LinkTracker.Link_id) AS tracker_link_count
 FROM 
   absyz_email_track.Recipient_Details
   INNER JOIN absyz_email_track.Mail_Message 
     ON absyz_email_track.Mail_Message.User_Id = absyz_email_track.Recipient_Details.Recipient_id
       AND absyz_email_track.Mail_Message.Message_Unique_Key = "${MessageKey}"
   INNER JOIN absyz_email_track.Tracker 
     ON absyz_email_track.Tracker.user_id = absyz_email_track.Recipient_Details.Recipient_id
       AND absyz_email_track.Tracker.message_id = absyz_email_track.Mail_Message.MessageId
   Left JOIN absyz_email_track.LinkTracker 
     ON absyz_email_track.LinkTracker.user_id = absyz_email_track.Recipient_Details.Recipient_id
       AND absyz_email_track.LinkTracker.message_id = absyz_email_track.Mail_Message.MessageId
 GROUP BY 
   absyz_email_track.Recipient_Details.Recipient_id,
   absyz_email_track.Mail_Message.MessageId,
   absyz_email_track.Tracker.tracker_id
`
   )
   console.log(MessageData, "Gmail message")
   res.send(MessageData);
};

module.exports = recipientDataHandler;
