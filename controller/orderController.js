const userModel = require('../model/userSchema')
const productModel = require("../model/productSchema");
let cartModel = require("../model/cartschema");
const orderModel = require('../model/orderSchema');
const razorpayController = require('../controller/razorpayController')
const cartFunctions = require('../controller/cartFunctions');
const { totalAmount } = require('../controller/cartFunctions');
const couponModel = require('../model/couponSchema');



module.exports = {

    confirmOrderButton: async (req, res, next) => {
        try {
            userId = req.session.userId
            let cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').lean()
            var totalAmount = await cartFunctions.totalAmount(cartData);
            let totalAmounts = totalAmount * 100;

            if (req.session.coupon) {

                let discountAmount = req.session.coupon.discountAmount;

                var totalAmount = totalAmount - discountAmount
                //add userID to coupon //
                await couponModel.findOneAndUpdate({ _id: req.session.coupon._id }, { $set: { users: userId } })

            }

            let orderData = await orderModel.create({ userId: userId, "billingAddress": req.body, "products": cartData.products, "status": "placed", "paymentMethod": req.body.paymentMethod, grandTotal: totalAmount })


            orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();



            req.session.orderData = orderData
            if (orderData.paymentMethod == 'COD') {
                req.session.orderData = null;

                req.session.confirmationData = { orderDataPopulated, totalAmount };
                res.json({ status: "COD", totalAmounts, orderData })
            } else if (orderData.paymentMethod == 'Online Payment') {
                let orderData = req.session.orderData
                req.session.orderData = null;
                razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)

                await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
                razorId = process.env.RAZOR_PAY_ID;

                req.session.confirmationData = { orderDataPopulated, totalAmount };

                res.json({ message: 'success', totalAmounts, razorData, orderData });
            }
        } catch (error) {
            next(error)
        }

    },
    verifyPay: async (req, res, next) => {
        try {
            success = await razorpayController.validate(req.body);
            if (success) {
                await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "success" });
                return res.json({ status: "true" });
            }
            else {
                await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
                return res.json({ status: "failed" });
            }
        } catch (error) {
            next(error)
        }
    },
    confirmationPage: async (req, res, next) => {
        try {
            await cartModel.findOneAndDelete({ userId: userId })
            let orderDataPopulated = req.session.confirmationData.orderDataPopulated
            let totalAmount = req.session.confirmationData.totalAmount;

            res.render('user/orderConfirmation', { orderDataPopulated, totalAmount });
        } catch (error) {
            next(error)
        }
    },

} 