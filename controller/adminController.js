const userModel = require("../models/userModel");
const vendorModel = require("../models/vendorModel");
const Razorpay = require("razorpay");
const orderModel = require("../models/orderSchema");
const higherBidderModel = require("../models/higherBidModel");
const crypto = require("crypto");

const paymentInit = async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Something Went Wrong!" });
        }
        res.status(200).json({ data: order });
    });
};

const verifyPayment = async (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.params.userId;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

    if (razorpay_signature === expectedSign) {
        const order = new orderModel({
            amount: amount,
            ItemId: itemId,
            userId: userId,
            razorpay_payment_id: razorpay_payment_id,
        });

        await order.save();

        const highestBidder = await higherBidderModel.findOne({ itemId: itemId });

        if (!highestBidder) {
            return res.status(404).json({
                status: "failed",
                message: "highestBidder is not found",
            });
        }

        highestBidder.paid = true;

        await highestBidder.save();

        res.status(200).json({
            status: "success",
            message: "Payment verified successfully",
            data: order,
            highestBidder,
        });
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }
};

const getAllUsers = async (req, res) => {
    const users = await userModel.find({});

    return res.status(200).json({
        status: "success",
        message: "all users listed",
        data: users,
    });
};

const getAllVendors = async (req, res) => {
    const vendors = await vendorModel.find({});

    return res.status(200).json({
        status: "success",
        message: "all vendors listed",
        data: vendors,
    });
};

module.exports = { getAllUsers, getAllVendors, paymentInit, verifyPayment };
