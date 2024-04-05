const userModel=require("../models/userModel")
const vendorModel=require("../models/vendorModel")



const getAllUsers = async(req,res) => {
    const users = await userModel.find({})

    return res.status(200).json({
        status:'success',
        message:'all users listed',
        data:users
    })
}

const getAllVendors = async(req,res) => {
    const vendors = await vendorModel.find({})

    return res.status(200).json({
        status:'success',
        message:'all vendors listed',
        data:vendors
    })
}





module.exports = {getAllUsers,getAllVendors}