const addressModel = require('../model/addressSchema')
let cartModel = require("../model/cartschema");
const cartFunctions = require('../controller/cartFunctions');
const couponModel = require('../model/couponSchema')

module.exports = {
    checkoutPage: async (req, res, next) => {
        userId = req.session.userId
        try {
            let addressData = await addressModel.find({ userId: userId }).lean()
            let cartData = await cartModel.findOne({ userId: userId }).populate("products.productId").lean()
            totalAmount = await cartFunctions.totalAmount(cartData);
            let couponData = await couponModel.find().lean()
            res.render('user/checkOut', { addressData, cartData, totalAmount, couponData })
        } catch (error) {
            next(error)
        }
    },
    billingAddress: async (req, res, next) => {
        try {
            userId = req.session.userId;
            let address = await addressModel.findOne({ userId: userId, _id: req.body.address }).lean();
            res.json({ message: "this is succesfully", address });
        } catch (error) {
            next(error)
        }
    },
}