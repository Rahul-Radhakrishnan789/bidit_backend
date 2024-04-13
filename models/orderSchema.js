const mongoose=require("mongoose")



const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
    },
    ItemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bid",
    },
    razorpay_payment_id:{
        type:String
    }
})

const order=mongoose.model('order',orderSchema)

module.exports=order