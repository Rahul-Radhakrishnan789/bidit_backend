const express=require("express")
const router=express.Router()
const User=require("../controller/userController")
const tryCatch=require("../middlewares/tryCatch")
const upload = require("../middlewares/multerMiddleware")



router.post("/commonregister",upload.array("images",5),tryCatch(User.commonRegister)) 
router.post("/commonlogin",tryCatch(User.commonLogin)) 
router.post("/placebid/:userId/:itemId",tryCatch(User.placeBid))
router.get("/fetchdata/:itemId",tryCatch(User.showAllData))
router.post("/userRegister",upload.array("images",5),tryCatch(User.userRegister))





module.exports=router