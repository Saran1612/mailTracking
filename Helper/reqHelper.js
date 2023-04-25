const Incominrequet = async(req,res,next)=>{
    try{
    const userAgent = req.headers['user-agent'];
    const isFromGmail = userAgent.includes('GmailImageProxy');
    if (isFromGmail) {
        next();
      }else{
        res.status(500).send("Bad Request");

      }
    }catch(error){
        res.status(500).send(error);

    }
}
module.exports = Incominrequet;