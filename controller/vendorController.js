const createBidModel = require("../models/createBidModel");
const higherBidderModel = require('../models/higherBidModel')
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary");

const saveHighestBidder = async (req, res) => {
  const ItemId = req.params.itemId;



  const itemData = await createBidModel.findById(ItemId).populate("bidders");

  if (!itemData) {
    return res.status(404).json({
      status: "failure",
      message: "bidder not found",
    });
  }


  let highestBidder = null;
  let highestAmount = -Infinity;
  itemData.bidders.forEach((bidder) => {
    if (bidder.amount > highestAmount) {
      highestAmount = bidder.amount;
      highestBidder = bidder;
    }
  });

  if (!highestBidder) {
    return res.status(404).json({
      status: "failure",
      message: "No bidders found",
    });
  }

  const existingData = await higherBidderModel.findOne({
    itemId: ItemId,
  });

  console.log("existing daata",existingData)

 
  if (existingData) {
    return res.status(500).json({
      status: "success",
      message: "Data already exists in the database",
      data: existingData,
    });
  }


const highestBidderData = new higherBidderModel({
  itemId:ItemId,
  highestBidderId:highestBidder
})


await highestBidderData.save()

  

  res.status(200).json({
    status: "success",
    message: "Fetching highest bidder successful",
    data: highestBidderData,
  });
};


const fetchUserBids = async (req,res) => {

  

  const userBids = await higherBidderModel.find({}).populate({
    path:'highestBidderId',
    populate:[{path:"bidItem", select:'itemName images amount description'}]
  })


  res.status(200).json({
    status: "success",
    message: "Fetching user bids successful",
    data: userBids
  });

}

const createBid = async (req, res) => {
  const vendorId = req.params.vendorId;

  let urls = [];

  const { itemName, basePrice, description, category, auctionDuration } =
    req.body;

  const uploader = async (path) => await cloudinary.uploads(path, "images");
  if (req.method == "POST") {
    const files = req.files;

    for (const file of files) {
      const { path } = file;

      const newPath = await uploader(path);

      urls.push(newPath);

      fs.unlinkSync(path);
    }

    const newBid = new createBidModel({
      vendorId,
      itemName,
      basePrice,
      description,
      category,
      auctionDuration,
      images: urls,
    });

    await newBid.save();
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
};

const displayBids = async (req, res) => {

  const vendorId = req.params.id;

  const bids = await createBidModel.find({vendorId:vendorId});

  return res.status(200).json({
    status: "success",
    message: "all bids fetched succefully",
    data: bids,
  });
};

const displayAllBids =  async (req, res) => {


  const bids = await createBidModel.find({});

  return res.status(200).json({
    status: "success",
    message: "all bids fetched succefully",
    data: bids,
  });
};

const getWinners = async (req,res) => {
  vendorId = req.params.id;

  const winnersData = await higherBidderModel.find({ paid: true }) 
  .populate({
     path: 'itemId',
     match: { vendorId: vendorId },
   }).populate({
    path: 'highestBidderId',
    populate:'userId',
    select:'username email amount'
   
  });

 
   return res.status(200).json({
    status: "success",
    message: "all bids fetched succefully",
    data: winnersData,
  });

}

const deleteBid = async (req, res) => {
  const bidId = req.params.id;

  const deletedBid = await createBidModel.findByIdAndDelete(bidId);

  if (!deletedBid) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    status:"success",
    message: "User deleted successfully",
    data:deletedBid
  });  
}

const editBid = async (req, res) => {
  const bidId = req.params.id;
  const updatedData = req.body;


  let updatedImages = [];
  if (req.files) {
    const uploader = async (path) => await cloudinary.uploads(path, "images"); 
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      updatedImages.push(newPath.url); 
      fs.unlinkSync(path); 
    }
  }

 
  if (updatedData.images && updatedImages.length > 0) {
    updatedData.images = updatedData.images.concat(updatedImages); 
  } else {
    updatedData.images = updatedImages.length > 0 ? updatedImages : undefined; 
  }

  const editedBid = await createBidModel.findByIdAndUpdate(bidId, updatedData, { new: true });

  if (!editedBid) {
    return res.status(404).json({ error: 'Bid not found' });
  }

  console.log(editedBid);

  return res.json({
    status: "success",
    message: 'Bid updated successfully',
    data: editedBid,
  });
};


module.exports = { createBid, displayBids, saveHighestBidder,fetchUserBids,displayAllBids,getWinners,deleteBid,editBid };
