const mongoose = require("mongoose")


const userBids = new mongoose.Schema({
    user:{
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
        dafault:false
      }
})

const UserBid = mongoose.model('UserBid', UserBidSchema);

module.exports = UserBid;