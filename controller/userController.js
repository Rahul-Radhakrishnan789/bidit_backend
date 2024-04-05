const userModel=require("../models/userModel")
const vendorModel=require("../models/vendorModel")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')






const  commonRegister=async(req,res)=>{
     
    const {username,email,password,isVendor,isGoogleUser}=req.body
//    const hashedPassword=await bcrypt.hash(password,10)

    console.log(username,email,password,isVendor,isGoogleUser);


    if(isVendor){
        const vendor=await vendorModel.findOne({email:email})
        if(!vendor){
            const hashedPassword=await bcrypt.hash(password,10)
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

        if (isGoogleUser && !password) {

            const USER=new userModel({
                username:username,email:email
            })
         
            const user=await USER.save()
            const token = jwt.sign({
                        userId: user?._id,
                        
                    },
                    process.env.SECRET_KEY_USER, { expiresIn: '72h' }
                    );
        
                    return res.status(201).json({
                        status:"success",
                        message:"user registration successfull",
                        data:email,
                        token:token,
                        type:"googleuser"
                    })


        }
       
        const hashedPassword=await bcrypt.hash(password,10)
        
        const USER=new userModel({
            username:username,email:email,password:hashedPassword
        })
        await USER.save()
        // if(isGoogleUser){
        //     const token = jwt.sign({
        //         userId: user?._id,
                
        //     },
        //     process.env.SECRET_KEY_USER, { expiresIn: '72h' }
        //     );

        //     return res.status(201).json({
        //         status:"success",
        //         message:"user registration successfull",
        //         data:email,
        //         token:token,
        //         type:"googleuser"
        //     })

        // }
        return res.status(201).json({
            status:"success",
            message:"user registration successfull",
            data:email,
            type:"normalUser"
        })
        
    }
    return res.status(301).json({
        message:"user already registered ,please login",

    })




}


const commonLogin=async(req,res)=>{
    const {email,password,isVendor}=req.body

    console.log(email,password,isVendor);

    if(isVendor){
        const ventor=await vendorModel.findOne({email:email})

        console.log("ventor",ventor);

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
    return   res.status(301).json({
        message:"please  register your account"
    })




 

}


module.exports={commonRegister,commonLogin}