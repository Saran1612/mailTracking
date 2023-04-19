const MysqlQueryExecute = require("../DB_Execute/DB_Connection");
const getLinkDataHandler = async (req, res, next) => {
    const RecipientId = req.query.RecipientId;
    const MessageId = req.query.MessageId;
    const MessageData = await MysqlQueryExecute(`SELECT * from absyz_email_track.LinkTracker lt INNER JOIN absyz_email_track.Recipient_Details rd ON lt.user_id =
    rd.Recipient_id INNER JOIN absyz_email_track.Mail_Message mm ON lt.message_id = mm.MessageId where rd.Recipient_id = ${RecipientId}
    and mm.MessageId = ${MessageId};
 `
    )
    console.log(MessageData, "Gmail message")
    res.send(MessageData);
}
module.exports = getLinkDataHandler