
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;

app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname)
};
 
var fileName = "rect.png";
 
  console.log(req,"request");
  const timestamp = new Date();
  console.log(timestamp,"time");
  res.sendFile(fileName, options, function (err) {
    if (err) {
        // next(err);
    } else {
        console.log('Sent:', fileName);
        
    }
});
  // Log the email open
});
app.listen(PORT, function(err){
  console.log(`server started on port ${PORT}`);
});
