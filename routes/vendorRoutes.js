const express = require("express")
const router = express.Router();
const Vendor = require("../controller/vendorController")
const tryCatch = require("../middlewares/tryCatch")
const upload = require("../middlewares/multerMiddleware")

router.post("/createBid/:vendorId",upload.array("images",5),tryCatch(Vendor.createBid))

router.get("/getbids/:id",tryCatch(Vendor.displayBids))

router.get("/getallbids",tryCatch(Vendor.displayAllBids))

router.post("/savehighestbidder/:itemId",tryCatch(Vendor.saveHighestBidder))

router.get("/fetchuserbids",tryCatch(Vendor.fetchUserBids))

router.get("/getwinners/:id",tryCatch(Vendor.getWinners))

router.delete("/deletebid/:id",tryCatch(Vendor.deleteBid))

router.put("/editbid/:id",upload.array("images",5),tryCatch(Vendor.editBid))



module.exports = router