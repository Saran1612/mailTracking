const express=require("express")
const router=express.Router();
const CreateRecipientandMessage = require("../Handler/createRecipient")
const TrackPixelHandler = require("../Handler/trackingPixelHandler")
const TrackLinkHandler = require("../Handler/linkTrackHandler")
const GetMessageHandler = require("../Handler/messageHandler")
const recipientDataHandler = require("../Handler/recipientHandler");
const linkTrackHandler = require("../Handler/linkTrackDataHandler");
const rateLimit = require("express-rate-limit");
const IncominRequestHelper = require("../Helper/reqHelper")


/***All the routes */
router.post("/RecipientDetails",CreateRecipientandMessage);
router.get("/TrackingPixel",IncominRequestHelper, TrackPixelHandler);
router.get("/TrackLink", TrackLinkHandler);
router.get("/GetMessageByDate", GetMessageHandler);
router.get("/GetRecipients", recipientDataHandler);
router.get("/getTrackerLinkData",linkTrackHandler);

  
// Importing the router
module.exports=router