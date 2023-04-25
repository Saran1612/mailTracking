
const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const moment = require("moment");
const path = require("path");
const NodeCache = require("node-cache");

const cache = new NodeCache();

const TrackLinkHandler = async (req, res, next) => {
    let url = req.query.url;
  let email = req.query.email;
  let UID = req.query.msgId;
  let subject = req.query.subject;
  const userAgent = req.headers['user-agent'];
  console.log(userAgent,"Check user Agent");
  console.log(email, "Check email");
  console.log(url, "Check url");
  const cacheKey = `${email}-${UID}-${url}`;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return res.send(cachedResponse);
  }
  try{
  if(url){
  res.redirect(url);
  }
}catch(error){
  console.log(error,"Check error finale");
}
  try {
    // let email = req.query.email;
    
    // let subject = req.query.subject;
    console.log(email, UID, subject, "check final query params");
    const [MessageCount] =
      await MysqlQueryExecute(`Select COUNT(*) as TrackerCount from absyz_email_track.Mail_Message INNER JOIN 
      absyz_email_track.Recipient_Details ON absyz_email_track.Recipient_Details.RecipientEmail = "${email}" 
      and absyz_email_track.Mail_Message.Message_Unique_Key = "${UID}"`);

    if (MessageCount.TrackerCount === 0) {
      let countQuery = `SELECT Recipient_id ,COUNT(Recipient_id) AS RecipientCount FROM absyz_email_track.Recipient_Details WHERE  RecipientEmail = "${email}"`;
      let Recipient_Data = await MysqlQueryExecute(countQuery);
      if (Recipient_Data[0].RecipientCount === 0) {

        const recipientResult = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Recipient_Details (RecipientEmail) VALUES ("${email}")`
        );
        const currentDateTimeString = moment().format("YYYY-MM-DD HH:mm:ss");
        const CreateMessage = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.insertId}, "${subject}", "${UID}", "${currentDateTimeString}")`
        );
        const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id, Count ) 
            VALUES ("${url}", ${recipientResult.insertId}, ${CreateMessage.insertId}, 1)
        `);
        
      } else {
        const [recipientResult] = await MysqlQueryExecute(
          `Select Recipient_id as RecipientsId from absyz_email_track.Recipient_Details where RecipientEmail = "${email}"`
        );
        // console.log(recipientResult.RecipientsId, "Check recp");
        const currentDateTimeString = moment().format("YYYY-MM-DD HH:mm:ss");
        const CreateMessage = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.RecipientsId}, "${subject}", "${UID}", "${currentDateTimeString}")`
        );
        const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id, Count) 
            VALUES ("${url}", ${recipientResult.RecipientsId}, ${CreateMessage.insertId}, 1)
        `);
        
      }
    } else {
      const TrackerCountInc =
        await MysqlQueryExecute(`UPDATE absyz_email_track.LinkTracker
  INNER JOIN absyz_email_track.Recipient_Details ON absyz_email_track.Recipient_Details.Recipient_id = 
  absyz_email_track.LinkTracker.user_id AND absyz_email_track.Recipient_Details.RecipientEmail = "${email}"
  INNER JOIN absyz_email_track.Mail_Message ON absyz_email_track.Mail_Message.MessageId = 
  absyz_email_track.LinkTracker.message_id AND absyz_email_track.Mail_Message.Message_Unique_Key = "${UID}"
  SET absyz_email_track.LinkTracker.Count = absyz_email_track.LinkTracker.Count + 1
  WHERE absyz_email_track.LinkTracker.Link = "${url}";
  `);
    }
   
    
  } catch (error) {
    console.log(error, "Checking error");
  }
};

module.exports = TrackLinkHandler;
