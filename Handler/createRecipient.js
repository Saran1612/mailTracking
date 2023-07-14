
const MysqlQueryExecute = require("../DB_Execute/DB_Connection")
const moment = require('moment');


const CreateRecipientandMessage = async (req, res, next) => {
  // console.log(req.body, "Check body final");
  const RecipientData = req.body;
  console.log(RecipientData, "RecipientDataRecipientData")
  let createdRecipient = false;
  try {
    await MysqlQueryExecute('START TRANSACTION');
    let senderId;
    const [SenderExist] = await MysqlQueryExecute(`SELECT senderId, COUNT(senderId) as senderCount from absyz_email_track.Sender WHERE senderMail = "${RecipientData.senderMail}"`);
    // console.log(SenderExist,"Sender exist");
    if (SenderExist.senderCount === 0) {
      const InsertedSender = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Sender(senderMail) VALUES ("${RecipientData.senderMail}") `);
      console.log(InsertedSender, "Check sender details")
      senderId = InsertedSender.insertId;
    } else {
      senderId = SenderExist.senderId;
    }
    console.log(senderId);
    for (const item of RecipientData.messages) {
      let countQuery = `SELECT Recipient_id ,COUNT(Recipient_id) AS RecipientCount FROM absyz_email_track.Recipient_Details WHERE  RecipientEmail = "${item.email}"`;
      let Recipient_Data = await MysqlQueryExecute(countQuery);
      // console.log(Recipient_Data,"Final Count Check");
      if (Recipient_Data[0].RecipientCount === 0) {
        // try{
        const recipientResult = await MysqlQueryExecute(
          `INSERT INTO absyz_email_track.Recipient_Details (RecipientEmail) VALUES ("${item.email}")`,
        );
        const currentDateTimeString = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(currentDateTimeString, "currentDateTimeString")
        console.log(recipientResult.insertId, "Check recp");
        const CreateMessage = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time, Sender_id) VALUES (${recipientResult.insertId}, "${item.subject}", "${item.MessageId}", "${currentDateTimeString}", ${senderId})`);
        console.log(CreateMessage.insertId, "Check created Message");

        const TrackerData = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp) VALUES(${recipientResult.insertId}, ${CreateMessage.insertId}, "${currentDateTimeString}")`);
        if (item.linkCount > 0) {
          const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id) 
            VALUES 
              ${item.links.map(link => `('${link}', ${recipientResult.insertId}, ${CreateMessage.insertId})`).join(',')}
          `);
          // createdRecipient = true;
        }
        // }catch(error){
        //     console.log(error, "Error while create Recipientcddc");
        //     // await MysqlQueryExecute('ROLLBACK');
        //     createdRecipient = false;
        // }
      } else {
        // try{
        const [recipientResult] = await MysqlQueryExecute(
          `Select Recipient_id as RecipientsId from absyz_email_track.Recipient_Details where RecipientEmail = "${item.email}"`,
        );
        const currentDateTimeString = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(currentDateTimeString, "currentDateTimeString")
        console.log(recipientResult.RecipientsId, "Check recp");
        const CreateMessage = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time, Sender_id) VALUES (${recipientResult.RecipientsId}, "${item.subject}", "${item.MessageId}","${currentDateTimeString}", ${senderId})`);
        console.log(CreateMessage.insertId, "Check created Message");

        const TrackerData = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp) VALUES(${recipientResult.RecipientsId}, ${CreateMessage.insertId}, "${currentDateTimeString}")`);
        if (item.linkCount > 0) {
          const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id) 
            VALUES 
                ${item.links.map(link => `('${link}', ${recipientResult.RecipientsId}, ${CreateMessage.insertId})`).join(',')}
          `);
        }
      }

    }
    await MysqlQueryExecute('COMMIT');
    createdRecipient = true;
    res.send({ message: "Recipient Created Successfully" });
  } catch (error) {
    console.log(error, "Check error final");
    const Roolback = await MysqlQueryExecute('ROLLBACK');
    console.log(Roolback, "Roolback");
    res.status(500).send({ message: "Error while inserting data onto existing Recipient" });
    createdRecipient = false;
  }

};

module.exports = CreateRecipientandMessage;
