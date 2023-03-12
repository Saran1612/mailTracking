const moment = require("moment")
 const mailDataHandler = async(Data, res)=>{
    
    console.log(Data, "Data of date");
    let TestObj = [{Subject: null, Index: []}];
    let indexex = [];
    let MessageData = Data.map((data,index)=>{
        if(!indexex.includes(data.Mail_Subject)){
       return indexex.push(data.Mail_Subject)
        }
    })
    console.log(indexex,"Indexex");
    let FinalArray = [];
    for(var IndIndex of indexex){
        let selectedindex = [];
        let FinalData = Data.filter(data => data.Mail_Subject === IndIndex).map((filtreddata,index)=>{
            // if(data.Mail_Subject === IndIndex){
                selectedindex.push(index); 
                let UtcDate = moment(filtreddata.User_TimeStamp);
                var dateWithTimezone = UtcDate.tz('Asia/Calcutta|Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
                return{
                    Mail: filtreddata.Mail_Subject,
                    UserName:filtreddata.USER_NAME,
                    UserOpendTime: dateWithTimezone,
                    Count: filtreddata.Count
                // }
            }
        })
        FinalArray.push({MailSubject: IndIndex , UserDetails:FinalData})
        console.log(FinalData,"selectedindex");
    }
    res.send(FinalArray)

}
module.exports = {mailDataHandler};