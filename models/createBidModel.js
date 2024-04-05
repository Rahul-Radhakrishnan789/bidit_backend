const mongoose = require("mongoose")


const createBid = new mongoose.Schema({
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    itemName:{
        type:String,
    },
    basePrice:{
        type:Number
    },
    description:{
        type:String
    },
    category:{
        type:String
    },
    startTime: { 
        type: Date,
        default: Date.now()
    },
     auctionDuration:{
        type:Date

    },
    images:{
        type:Array
    },
    bidders:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserBid'
     },
     highestBidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    highestBidAmount:{
        type:Number
    },
   
})


const Bid = mongoose.model('Bid', createBid);

module.exports = Bid;