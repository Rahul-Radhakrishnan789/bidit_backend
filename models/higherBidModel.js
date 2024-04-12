const mongoose = require("mongoose")

const higherBidSchema = new mongoose.Schema({
   itemId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
   },
  highestBidderId:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'UserBid'
  },
  
})


const higherBid = mongoose.model('higherBid', higherBidSchema);

module.exports = higherBid;