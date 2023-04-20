const MysqlQueryExecute = require("../DB_Execute/DB_Connection")
const moment = require('moment');


const CreateRecipientandMessage = async (req, res, next)=>{
console.log(req.body, "Check body final");
const RecipientData = req.body;
for (const item of RecipientData) {
    let countQuery = `SELECT Recipient_id ,COUNT(Recipient_id) AS RecipientCount FROM absyz_email_track.Recipient_Details WHERE  RecipientEmail = "${item.email}"`;
  let Recipient_Data = await MysqlQueryExecute(countQuery);
  console.log(Recipient_Data,"Final Count Check");
  if(Recipient_Data[0].RecipientCount === 0){
    try{
        const recipientResult = await MysqlQueryExecute(
            `INSERT INTO absyz_email_track.Recipient_Details (RecipientEmail) VALUES ("${item.email}")`,
            
          );
          const currentDateTimeString = moment().format('YYYY-MM-DD HH:mm:ss');
          console.log(currentDateTimeString,"currentDateTimeString")
          console.log(recipientResult.insertId, "Check recp");
          const CreateMessage = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.insertId}, "${item.subject}", "${item.MessageId}", "${currentDateTimeString}")`);
          console.log(CreateMessage.insertId, "Check created Message");
          
        const TrackerData = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp) VALUES(${recipientResult.insertId}, ${CreateMessage.insertId}, "${currentDateTimeString}")`);
        if(item.linkCount > 0){
            const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id) 
            VALUES 
                ${item.links.map(link => `('${link}', ${recipientResult.insertId}, ${CreateMessage.insertId})`).join(',')}
        `);
        
        }

    }catch(error){
        console.log(error, "Error while create Recipientcddc");
        // await MysqlQueryExecute('ROLLBACK');
    }
  }
  else{
    try{
    const [recipientResult] = await MysqlQueryExecute(
        `Select Recipient_id as RecipientsId from absyz_email_track.Recipient_Details where RecipientEmail = "${item.email}"`,
        
      );
      
      const currentDateTimeString = moment().format('YYYY-MM-DD HH:mm:ss');
          console.log(currentDateTimeString,"currentDateTimeString")
      console.log(recipientResult.RecipientsId, "Check recp") ;
      const CreateMessage = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Mail_Message (User_Id, Message_Subject, Message_Unique_Key, Sent_Time) VALUES (${recipientResult.RecipientsId}, "${item.subject}", "${item.MessageId}","${currentDateTimeString}")`);
          console.log(CreateMessage.insertId, "Check created Message");
          
        const TrackerData = await MysqlQueryExecute(`INSERT INTO absyz_email_track.Tracker (user_id, message_id, Time_Stamp) VALUES(${recipientResult.RecipientsId}, ${CreateMessage.insertId}, "${currentDateTimeString}")`);
        if(item.linkCount > 0){
            const LinkData = await MysqlQueryExecute(`
            INSERT INTO absyz_email_track.LinkTracker (Link, user_id, message_id) 
            VALUES 
                ${item.links.map(link => `('${link}', ${recipientResult.RecipientsId}, ${CreateMessage.insertId})`).join(',')}
        `);
        
        }
        res.send({message: "Recipient Created Sucessfully"});
    }catch(error){
        console.log(error, "Error while inserting data onto exesting Recipient");
        res.send({message: "Recipient Not Created"});
    }

  }
  
  }
} 

module.exports = CreateRecipientandMessage;