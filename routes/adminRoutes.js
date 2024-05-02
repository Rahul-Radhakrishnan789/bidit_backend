const express=require("express")
const router=express.Router()
const Admin = require("../controller/adminController")
const tryCatch = require("../middlewares/tryCatch")


router.get("/getusers",tryCatch(Admin.getAllUsers))

router.get("/getvendors",tryCatch(Admin.getAllVendors))

router.post('/paymentstart',tryCatch(Admin.paymentInit))

router.post('/paymentfinal/:itemId/:userId',tryCatch(Admin.verifyPayment))

router.get("/getallwinners",tryCatch(Admin.getAllWinners))

router.get("/getallbids",tryCatch(Admin.getAllBids))

router.post('/paymentforregister',tryCatch(Admin.verifyPaymentForRegister))




module.exports = router