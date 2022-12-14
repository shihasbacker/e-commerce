const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
       type:String
    },
    brandName: {
        type:String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    description: {
        type:String
    },
    stock: {
        type:Number
    },
    amount: {
        type:Number
    },
    discount: {
        type:Number
    },
    imagepath: {
        type:Array
    }
})
const productModel=mongoose.model('products',productSchema)
module.exports = productModel;