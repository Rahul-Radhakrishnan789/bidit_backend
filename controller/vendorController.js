const createBidModel = require("../models/createBidModel")
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary")



const createBid = async(req,res) => {
    const vendorId = req.params.vendorId;

    let urls = [];

    const {itemName,basePrice,description,category,auctionDuration} = req.body;

    const uploader = async (path) => await cloudinary.uploads(path,"images");
    if (req.method == "POST") {
      const files = req.files;

      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);

        urls.push(newPath);

        fs.unlinkSync(path);
      }

const  newBid = new createBidModel({
    vendorId,
    itemName,
    basePrice,
    description,
    category,
    auctionDuration,
    images:urls
});

await newBid.save()
res.status(200).json({
    status: "success",
    message: "Bid created succesfully",
    data: newBid,
  });
} else {
    res.status(400).json({
      err: " image not uploaded",
    });
  }
}


const displayBids = async(req,res) => {

    const bids = await createBidModel.find({})

    return res.status(200).json({
        status:'success',
        message:'all bids fetched succefully',
        data:bids,
    })

}


module.exports = {createBid,displayBids}
