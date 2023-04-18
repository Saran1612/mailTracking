const express=require("express")
const router=express.Router();
const CreateRecipientandMessage = require("../Handler/createRecipient")
const TrackPixelHandler = require("../Handler/trackingPixelHandler")
const TrackLinkHandler = require("../Handler/linkTrackHandler")
router.post("/RecipientDetails",CreateRecipientandMessage);
router.get("/TrackingPixel", TrackPixelHandler);
router.get("/TrackLink", TrackLinkHandler);
  
// Importing the router
module.exports=router