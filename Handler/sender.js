const MysqlQueryExecute = require("../DB_Execute/DB_Connection");


const getSender = async(req, res, next)=>{
    const senderMail = req.query.senderMail;
    console.log(senderMail,"Check sender mail");
    const senderId = await MysqlQueryExecute(`SELECT senderMail, senderId from absyz_email_track.Sender where senderMail = "${senderMail}"`);
    console.log(senderId,"Check the sender Id");
    res.send(senderId);
}
module.exports=getSender;