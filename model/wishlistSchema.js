
const mongoose = require("mongoose");


const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
        // required:true
    },
    products: [
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'products'
        },
            price: {
                type: Number,
                default:0
           }
      
        }    
]

});

const wishlistModel = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlistModel;