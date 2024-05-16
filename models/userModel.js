const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
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

const User = mongoose.model("User",userSchema)

module.exports = User