const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const moment = require("moment");
const path = require("path");

const TrackPixelHandler = async (req, res, next) => {
  try {
    let email = req.query.email;
    let UID = req.query.msgId;
    let subject = req.query.subject;
    console.log(email, UID, subject, "check final query params");
    const [MessageCount] =
      await MysqlQueryExecute(`Select COUNT(*) as TrackerCount from absyz_email_track.Mail_Message INNER JOIN 
      absyz_email_track.Recipient_Details ON absyz_email_track.Recipient_Details.RecipientEmail = "${email}" 
      and absyz_email_track.Mail_Message.Message_Unique_Key = "${UID}"`);

    if (MessageCount.TrackerCount === 0) {
      let countQuery = `SELECT Recipient_id ,COUNT(Recipient_id) AS RecipientCount FROM absyz_email_track.Recipient_Details WHERE  RecipientEmail = "${email}"`;
      let Recipient_Data = await MysqlQueryExecute(countQuery);
      if (Recipient_Data[0].RecipientCount === 0) {
        const currentDateTimeString = moment().format("YYYY-MM-DD HH:mm:ss");
        const recipientResult = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Recipient_Details (RecipientEmail) VALUES ("${email}")`
        );
        const CreateMessage = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.insertId}, "${subject}", "${UID}", "${currentDateTimeString}")`
        );
        
        const TrackerData = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp, Count) VALUES(${recipientResult.insertId}, ${CreateMessage.insertId}, "${currentDateTimeString}", 1)`
        );
      } else {
        const [recipientResult] = await MysqlQueryExecute(
          `Select Recipient_id as RecipientsId from absyz_email_track.Recipient_Details where RecipientEmail = "${email}"`
        );
        console.log(recipientResult.RecipientsId, "Check recp");
        const currentDateTimeString = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(currentDateTimeString, "currentDateTimeString");
        const CreateMessage = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.RecipientsId}, "${subject}", "${UID}", "${currentDateTimeString}")`
        );
        console.log(CreateMessage.insertId, "Check created Message");
        
        const TrackerData = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp, Count) VALUES(${recipientResult.RecipientsId}, ${CreateMessage.insertId}, "${currentDateTimeString}", 1)`
        );
      }
    } else {
      const TrackerCountInc =
        await MysqlQueryExecute(`UPDATE absyz_email_track.Tracker
  INNER JOIN absyz_email_track.Recipient_Details ON absyz_email_track.Recipient_Details.Recipient_id = 
  absyz_email_track.Tracker.user_id AND absyz_email_track.Recipient_Details.RecipientEmail = "${email}"
  INNER JOIN absyz_email_track.Mail_Message ON absyz_email_track.Mail_Message.MessageId = 
  absyz_email_track.Tracker.message_id AND absyz_email_track.Mail_Message.Message_Unique_Key = "${UID}"
  SET absyz_email_track.Tracker.Count = absyz_email_track.Tracker.Count + 1;
  `);
    }
    var fileName = "rect.png";
    var options = {
      root: path.join(__dirname, ".."),
    };
    res.set("Content-Type", "image/png");
    // Set the cache control headers to prevent caching
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.sendFile(fileName, options, function async(err) {
      if (err) {
        // next(err);
        console.log(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  } catch (error) {
    console.log(error, "Checking error");
  }
};

module.exports = TrackPixelHandler;
