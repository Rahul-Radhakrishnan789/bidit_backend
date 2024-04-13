const express=require("express")
const router=express.Router()
const Admin = require("../controller/adminController")
const tryCatch = require("../middlewares/tryCatch")


router.get("/getusers",tryCatch(Admin.getAllUsers))

router.get("/getvendors",tryCatch(Admin.getAllVendors))

router.post('/paymentstart',tryCatch(Admin.paymentInit))

router.post('/paymentfinal/:itemId/:userId',tryCatch(Admin.verifyPayment))




module.exports = router