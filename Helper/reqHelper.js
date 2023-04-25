const Incominrequet = async(req,res,next)=>{
    try{
    const userAgent = req.headers['user-agent'];
    const isFromGmail = userAgent.includes('GmailImageProxy');
    const isFromGoogleImageProxy = userAgent.includes('GoogleImageProxy');
    console.log(userAgent,isFromGmail,isFromGoogleImageProxy,req.query.extsrc,req.query['gx-context'],"Test is from gmail");
    if (isFromGmail || isFromGoogleImageProxy) {
        next();
      }else{
        res.status(500).send("Bad Request");

      }
    }catch(error){
        res.status(500).send(error);

    }
}
module.exports = Incominrequet;