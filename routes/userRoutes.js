const express=require("express")
const router=express.Router()
const User=require("../controller/userController")
const tryCatch=require("../middlewares/tryCatch")



router.post("/commonregister",tryCatch(User.commonRegister)) 
router.post("/commonlogin",tryCatch(User.commonLogin)) 





module.exports=router