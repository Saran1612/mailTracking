// const nodemailer = require('nodemailer');
// const fs = require('fs');
// const path = require('path');
// const uuid = require('uuid').v4;
// const PNG = require('pngjs').PNG;
// const width = 100;
// const height = 100;
// const image = new PNG({ width, height });

// // Read the email content template from a file
// const emailContent = fs.readFileSync('email-template.html', 'utf-8');

// // Read the list of email addresses from a CSV file
// const emailList = fs.readFileSync('email-list.csv', 'utf-8').split('\n');
// console.log(emailList,"Check email list");

// const pixelData = Buffer.from([255, 0, 0, 255]); // red pixel
// const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header

// const pngData = Buffer.concat([pngHeader, pixelData]);
// // Create a transporter object using SMTP
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   auth: {
//     user: 'abhishekpoojary13@gmail.com',
//     pass: 'rfegawpugysghoxf',
//   },
// });

// // Generate unique trackers for each recipient and store them in a map
// const trackers = new Map();
// for (const line of emailList) {
//   const recipient = line.split(',')[0];
//   const trackerId = uuid();
//   fs.writeFile(`tracker-${trackerId}.png`, pngData, (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('File saved!');
//     }
//   });
// //   image.pack().pipe(fs.createWriteStream(`tracker-${trackerId}.png`));
//   trackers.set(recipient, trackerId);
// }
// console.log(trackers,"Recipient check");

// // Create a multi-part MIME message with unique trackers for each recipient
// const attachments = [];
// for (const [recipient, trackerId] of trackers) {
//   attachments.push({
//     filename: `tracker-${trackerId}.png`,
//     path: path.join(__dirname, `tracker-${trackerId}.png`),
//     cid: `tracker-${trackerId}`,
//   });
// }

// const message = {
//   from: 'abhishekpoojary13@gmail.com',
//   to: emailList.map(line => line.split(',')[0]),
//   subject: 'Your Subject Here',
//   html: emailContent,
//   attachments,
// };

// // Send the email to all recipients
// transporter.sendMail(message, (err, info) => {
//   if (err) {
//     console.error(err, "Console.log error");
//   } else {
//     console.log(info, "Info");
//   }
// });

// // Log the email opens using the unique trackers
// const express = require('express');
// const app = express();
// const port = 3000;

// app.get(`/tracker-:trackerId.png`, (req, res) => {
//   const trackerId = req.params.trackerId;
//   const recipient = trackers.get(req.query.recipient);

//   // Log the email open
//   console.log(`Email opened by ${recipient}`);

//   // Serve the tracker image
//   res.sendFile(path.join(__dirname, `tracker-${trackerId}.png`));
// });

// app.listen(port, () => {
//   console.log(`Tracker server listening at http://localhost:${port}`);
// });



const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const PNG = require('pngjs').PNG;
const width = 100;
const height = 100;

// Read the email content template from a file
const emailContent = fs.readFileSync('email-template.html', 'utf-8');

// Read the list of email addresses from a CSV file
const emailList = fs.readFileSync('email-list.csv', 'utf-8').split('\n');
console.log(emailList,"Check email list");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'abhishekpoojary13@gmail.com',
    pass: 'rfegawpugysghoxf',
  },
});

// Create a map to store the unique tracker image for each recipient
const trackers = new Map();

// Create a unique tracker image for each recipient and store it in the map
for (const line of emailList) {
  const recipient = line.split(',')[0];
  const trackerId = uuid();
  const image = new PNG({ width, height });

  // Draw a red pixel at the top left corner of the image
  image.data[0] = 255; // red
  image.data[3] = 255; // opaque

  // Save the tracker image to a file
  const filename = `tracker-${trackerId}-${recipient}.png`; // Include recipient in filename
  const filepath = path.join(__dirname, filename);
  image.pack().pipe(fs.createWriteStream(filepath));

  // Add the tracker image to the map for the recipient
  trackers.set(recipient, { id: trackerId, filename, filepath });
}
console.log(trackers,"Recipient check");

// Create a multi-part MIME message with a unique tracker image for each recipient
const attachments = [];
for (const [recipient, tracker] of trackers) {
  attachments.push({
    filename: tracker.filename,
    path: tracker.filepath,
    cid: `tracker-${tracker.id}-${recipient}`, // Include recipient in CID
  });
}

const message = {
  from: 'abhishekpoojary13@gmail.com',
  to: emailList.map(line => line.split(',')[0]),
  subject: 'Your Subject Here',
  html: emailContent,
  attachments,
};

// Send the email to all recipients
transporter.sendMail(message, (err, info) => {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});

// Log the email opens using the unique trackers
const express = require('express');
const app = express();
const port = 3000;

app.get(`/tracker-:trackerId-:recipient.png`, (req, res) => { // Include recipient in URL
  const trackerId = req.params.trackerId;
  const recipient = req.params.recipient; // Get recipient from URL
  const tracker = trackers.get(recipient); // Get tracker by recipient
    console.log(tracker, "Tracker check");
  if (tracker && tracker.id === trackerId) {
    // Log the email open
    console.log(`Email opened by ${recipient}`);

    // Serve the tracker image
    res.sendFile(tracker.filepath);
  } else {
    // Invalid tracker ID or recipient, return 404
    console.log(recipient, "Other recipient trying to check ur mail");

    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log(`Tracker server listening at http://localhost:${port}`);
});

