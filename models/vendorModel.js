const mongoose = require('mongoose')


const vendorSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    }
})

const Vendor = mongoose.Model("Vendor",vendorSchema)

module.exports = Vendor