const mongoose = require("mongoose")
const dayjs = require('dayjs') 

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
        type: String,
        default: () => dayjs().format('DD-MM-YYYY-HH-mm-ss')
    },
     auctionDuration:{
        type:Number
        
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