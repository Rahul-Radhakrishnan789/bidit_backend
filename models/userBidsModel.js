const mongoose = require("mongoose")


const userBids = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bidItem:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
      },
      isBidded:{
        type:Boolean,
        default:false
      },
      timeOfBid:{
        type:Date,
        default: Date.now()
      }
})

const UserBid = mongoose.model('UserBid', userBids);

module.exports = UserBid;