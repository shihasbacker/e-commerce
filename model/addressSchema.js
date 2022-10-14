const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
        // required:true
    },
    firstName: {
        type: String,
        // unique:true
    },

    lastName: {
        type: String,
        // unique:true
    },
    email:{
        type:String
    },
    phoneNumber: {
        type: Number,
    },
    pincode: {
        type: String,
        // unique:true
    },
    
    address: {
        type: String,
        // unique:true
    },
    city: {
        type: String,
    },
    state: {
        type: String,
        // unique:true
    },
      landmark: {
        type: String,
    },
    // alternatePhoneNumber: {
    //     type:Number,
    // }, 
    //   type: {
    //     type: String,
    //   }
  },{timestamps:true});
  
  const addressModel = mongoose.model("address", addressSchema);
  
  module.exports = addressModel;