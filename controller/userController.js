const userModel=require("../models/userModel")
const vendorModel=require("../models/vendorModel")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')






const  commonRegister=async(req,res)=>{
     
    const {username,email,password,isVendor}=req.body
    const hashedPassword=await bcrypt.hash(password,10)


    if(isVendor){
        const vendor=await vendorModel.findOne({email:email})
        if(!vendor){
            const VENDOR=new vendorModel({username:username,email:email,password:hashedPassword})
            VENDOR.save()

            return res.status(201).json({
                status:"success",
                message:"vendor registration successfull",
                data:email
            })

        }
        return res.status(301).json({
            message:"vendor already registered ,please login",

        })
    }

    const user=await userModel.findOne({email:email})

    if(!user){
        
        const USER=new userModel({
            username:username,email:email,password:hashedPassword
        })
        await USER.save()
        return res.status(201).json({
            status:"success",
            message:"user registration successfull",
            data:email
        })
        
    }
    return res.status(301).json({
        message:"user already registered ,please login",

    })




}


const commonLogin=async(req,res)=>{
    const {email,password,isVendor}=req.body

    if(isVendor){
        const ventor=await vendorModel.findOne({email:email})

        if(!ventor){
            return res.status(301).json({
                message:"ventor not registered,please Register"
            })
        }
        const comparePassword = await bcrypt.compare(password,ventor?.password)      
        if(comparePassword){
            const secret = process.env.SECRET_KEY_VENTOR;
            const token = jwt.sign({
                userId: ventor?._id,
                
            },
                secret, { expiresIn: '72h' }
            );

            return res.status(200).json({
                message:"ventor login successfull",
                data:token,
                Id: ventor?._id,
                type:"ventor"
            })
          
        }         

        return res.status(403).json({
            message:"invalid password",
          })
    
    }
    const user=await userModel.findOne({email:email})
    if(user){
        const comparePassword = await bcrypt.compare(password,user?.password) 
        // console.log("pass",comparePassword);
        if(comparePassword){
            const secret = process.env.SECRET_KEY_USER;
            const token = jwt.sign({
                userId: user?._id,
                
            },
                secret, { expiresIn: '72h' }
            );

            return res.status(200).json({
                message:"user login successfull",
                data:token,
                Id: user?._id,
                type:"user"
            })

        }
        return res.status(403).json({
            message:"invalid password",
          })
    }
    return   res.status(404).json({
        message:"please  register your account"
    })




 

}


module.exports={commonRegister,commonLogin}