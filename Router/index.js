const express=require("express")
const router=express.Router();
const CreateRecipientandMessage = require("../Handler/createRecipient")
const TrackPixelHandler = require("../Handler/trackingPixelHandler")
const TrackLinkHandler = require("../Handler/linkTrackHandler")
const GetMessageHandler = require("../Handler/messageHandler")
const recipientDataHandler = require("../Handler/recipientHandler");
const linkTrackHandler = require("../Handler/linkTrackDataHandler");
const rateLimit = require("express-rate-limit");

// Set up rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
});


/***All the routes */
router.post("/RecipientDetails",CreateRecipientandMessage);
router.get("/TrackingPixel", TrackPixelHandler);
router.get("/TrackLink",limiter, TrackLinkHandler);
router.get("/GetMessageByDate", GetMessageHandler);
router.get("/GetRecipients", recipientDataHandler);
router.get("/getTrackerLinkData",linkTrackHandler )

  
// Importing the router
module.exports=router