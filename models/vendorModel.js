const mongoose = require('mongoose')


const vendorSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
       mobile:{
        type:String,
    },
    images:{
        type:Array
    }
})

const Vendor = mongoose.model("Vendor",vendorSchema)

module.exports = Vendor