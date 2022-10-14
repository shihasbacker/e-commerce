const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required:true
    },
    heading: {
        type: String,
        required:true
    },
    subHeading:{
        type: String,
        required:true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    // couponId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Coupon'
    // }
   
    
    
});
const bannerModel = mongoose.model("banner", bannerSchema);
module.exports = bannerModel;