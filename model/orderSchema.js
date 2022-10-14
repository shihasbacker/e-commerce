const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    billingAddress:[
        {
        firstName: String,
        lastName:String,
        email:String,
        phoneNumber: Number,
        pincode: Number,
        address: String,
        city: String,
        state: String,
        landmark: String
    }],
    products:[
        {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"products",
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
            default:0
        }
        }
    ],
    orderId: String,
    status: String,
    paymentMethod: String, 
    grandTotal: Number,

},{timestamps:true})

const orderModel=mongoose.model('orders',orderSchema)
module.exports = orderModel;