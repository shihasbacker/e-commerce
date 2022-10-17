const addressModel = require('../model/addressSchema')
let cartModel = require("../model/cartschema");
const cartFunctions = require('../controller/cartFunctions');
const couponModel = require('../model/couponSchema')

module.exports={
    checkoutPage:async(req,res)=>{
        userId = req.session.userId
        let addressData = await addressModel.find({userId:userId}).lean()
        let cartData = await cartModel.findOne({userId:userId}).populate("products.productId").lean()
        console.log("cartDataFromCheckout page",cartData)
        totalAmount = await cartFunctions.totalAmount(cartData);
        let couponData = await couponModel.find().lean()
        res.render('user/checkOut',{addressData,cartData,totalAmount,couponData})
    },
    billingAddress:async(req,res)=>{
        userId = req.session.userId;
        // console.log("this is req body from billing:",req.body)
        let address = await addressModel.findOne({ userId: userId, _id: req.body.address }).lean();
        // console.log(address);
        res.json({message:"this is succesfully",  address });
    },
}