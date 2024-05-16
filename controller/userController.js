const userModel=require("../models/userModel")
const vendorModel=require("../models/vendorModel")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const bidItem = require("../models/createBidModel")
const userBid = require('../models/userBidsModel')
const cloudinary = require("../cloudinary/cloudinary")


const placeBid = async(req,res) => {
    const { amount } = req.body;
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    const itemData = await bidItem.findById(itemId).populate().exec()

    

   

    if (!itemData) {
        return res.status(404).json({
          status: "failure",
          message: "Item not found",
        });
      }

      if (amount <= itemData.basePrice) {
        return res.status(404).json({
          status: "failure",
          message: "amount should never get less than baseprice",
        });
      }

      const getRemainingTime = (startTime, auctionDuration) => {
        const currentTime = new Date();
        const endTime = new Date(startTime.getTime() + auctionDuration * 3600000);
        return Math.max(0, endTime - currentTime);
      };
      const remainingTime = getRemainingTime(
        itemData.startTime,
        itemData.auctionDuration
      );


      if (remainingTime !== 0 ) {
        const newBid = new userBid({
          userId,
          amount,
          bidItem:itemId,
        });

        await newBid.save();

       itemData.bidders.push(newBid._id)

       await itemData.save();

      

        console.log(itemData)


        res.status(200).json({
          status: "success",
          message: "bidding succesful",
          data: newBid,
        });
      }else{
        res.status(404).json({
            status: "failiure",
            message: "time limit has exceeded",
        })
      }

}

const showAllData = async (req,res) => {

    const itemId = req.params.itemId;

    const bids = await bidItem.findById({ _id: itemId }).populate({
        path: 'bidders',
        match: { bidItem: itemId },
        populate:[{path:'userId',
        select : 'username'}]
    })

    if (!bids) {
        return res.status(404).json({ message: 'Bidders not found' });
    }
    res.status(200).json({
        status: "success",
        message: "bids fetching succesful",
        data: bids,
    })

}



const  commonRegister=async(req,res)=>{
     
    const {username,email,password,isVendor,mobile}=req.body
//    const hashedPassword=await bcrypt.hash(password,10)
console.log('first', req.body)

    console.log(username,email,password,isVendor,);

    let urls = [];

    
  const uploader = async (path) => await cloudinary.uploads(path, "images");
  if (req.method == "POST") {
    const files = req.files;

    console.log('files',files)

    for (const file of files) {
      const { path } = file;

      const newPath = await uploader(path);

      urls.push(newPath);

      // fs.unlinkSync(path);
    }
  }

    if(isVendor){
        const vendor=await vendorModel.findOne({email:email})
        if(!vendor){
            const hashedPassword=await bcrypt.hash(password,10)
            const VENDOR=new vendorModel({
                username:username,
                email:email,
                password:hashedPassword,
                mobile:mobile,
                images:urls,
            })
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
    }

    const userRegister = async (req,res) => {

        const {username,email,password,mobile}=req.body

        console.log('first,',req.body)

        let urls = [];

    
        const uploader = async (path) => await cloudinary.uploads(path, "images");
        if (req.method == "POST") {
          const files = req.files;
      
          console.log('files',files)
      
          for (const file of files) {
            const { path } = file;
      
            const newPath = await uploader(path);
      
            urls.push(newPath);
      
            // fs.unlinkSync(path);
          }
        }

        const user=await userModel.findOne({email:email})

        if(user){
            return res.status(301).json({
                message:"user already registered ,please login",
            })
        }

        const hashedPassword=await bcrypt.hash(password,10)
        
        const USER=new userModel({
            username:username,
            email:email,
            password:hashedPassword,
            mobile:mobile,
            images:urls

        })
        await USER.save()

        return res.status(201).json({
            status:"success",
            message:"user registration successfull",
            data:email,
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
        const comparePassword = bcrypt.compare(password, ventor?.password)      
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
        const comparePassword = bcrypt.compare(password, user?.password) 
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


module.exports={commonRegister,commonLogin,placeBid,showAllData,userRegister}