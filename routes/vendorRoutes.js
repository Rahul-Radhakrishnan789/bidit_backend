const express = require("express")
const router = express.Router();
const Vendor = require("../controller/vendorController")
const tryCatch = require("../middlewares/tryCatch")
const upload = require("../middlewares/multerMiddleware")

router.post("/createBid/:vendorId",upload.array("images",5),tryCatch(Vendor.createBid))

router.get("/getbids",tryCatch(Vendor.displayBids))



module.exports = router