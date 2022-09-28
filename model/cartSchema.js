const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price:{
        type:Number,
        default:0
      }
    }
  ]
});

const cartModel=mongoose.model('cart',cartSchema)
module.exports = cartModel;
