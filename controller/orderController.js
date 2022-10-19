const userModel = require('../model/userSchema')
const productModel = require("../model/productSchema");
let cartModel = require("../model/cartschema");
const orderModel = require('../model/orderSchema');
const razorpayController = require('../controller/razorpayController')
const cartFunctions = require('../controller/cartFunctions');
const { totalAmount } = require('../controller/cartFunctions');
const couponModel = require('../model/couponSchema');



module.exports = {

    confirmOrderButton: async (req, res) => {
        userId = req.session.userId
        // console.log("prrrrrr")
        console.log("confirm order section:", req.body)
        // console.log("payment method from order",req.body.paymentMethod)


        let cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').lean()
       // console.log("cartData from checkout page page::",cartData);
        // req.session.cartData = cartData._id
        var totalAmount = await cartFunctions.totalAmount(cartData);
        //console.log("totalAmount",totalAmount);
        let totalAmounts = totalAmount * 100;
        
        if(req.session.coupon){
           
            let discountAmount = req.session.coupon.discountAmount;
           
            var totalAmount = totalAmount - discountAmount
            //add userID to coupon //
            await couponModel.findOneAndUpdate({_id:req.session.coupon._id},{$set:{users:userId}})
           
        }
        
        let orderData = await orderModel.create({ userId: userId, "billingAddress": req.body, "products": cartData.products, "status": "placed", "paymentMethod": req.body.paymentMethod, grandTotal: totalAmount})

        
        orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();
        
        
        
        req.session.orderData = orderData
       // console.log("orderdata session", req.session)
        if (orderData.paymentMethod == 'COD') {
            req.session.orderData = null;
            
            req.session.confirmationData = { orderDataPopulated, totalAmount };
            res.json({ status: "COD", totalAmounts, orderData })
        } else if (orderData.paymentMethod == 'Online Payment') {
            let orderData = req.session.orderData
            req.session.orderData = null;
            // console.log("order data ajax:", orderData._id)
            // console.log("amount data ajax:", totalAmounts)
            // console.log("session data ajax:", req.session)
            razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)
            
           

            await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
            //console.log("razordata returns;",razorData);
            razorId = process.env.RAZOR_PAY_ID;

            req.session.confirmationData = { orderDataPopulated, totalAmount };
            
            res.json({ message: 'success', totalAmounts, razorData, orderData });
        }
        console.log('session',req.session)

    },
    verifyPay: async (req, res, next) => {
        //console.log(req.body, "hihihihihihhhihhihh");
        success = await razorpayController.validate(req.body);
        if (success)
        {
           await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] },{paymentStatus:"success"});
           return res.json({ status: "true" });
        }
        else
        {
            await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
            return res.json({ status: "failed" });
            }
    },
    confirmationPage: async(req, res, next) => {
        console.log(req.session,"req.session");

        // let cartId = req.session.cartData
        await cartModel.findOneAndDelete({userId:userId})
        // let orderDataPopulated = await orderModel.findOne({_id:req.session.confirmationData.orderDataPopulated._id}).populate('products.productId').lean()
        // console.log("orderDataPopulated:::",orderDataPopulated)
        let orderDataPopulated = req.session.confirmationData.orderDataPopulated
       // console.log("orderData populated ;;;",orderDataPopulated);
        let totalAmount = req.session.confirmationData.totalAmount; 
       // console.log("totalAmount:",totalAmount)
        // req.session.confirmationData = null;
        res.render('user/orderConfirmation',{ orderDataPopulated, totalAmount });
    },
    
} 