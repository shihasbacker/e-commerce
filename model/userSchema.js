const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: String,
    // email:{
    //   type: String,
    //   unique: true
    // },
    email: String,
    phoneNumber: Number,
    password: String,
    block: Boolean,
    otpVerified:{
      type: Boolean,
      default: false
    },
  });

    userSchema.pre("save", async function(){
        
        // console.log(`the current pass is ${this.password}`);
        this.password= await bcrypt.hash(this.password,10)
        // this.passwordRepeat = await bcrypt.hash(this.passwordRepeat,10)
        // console.log(`the current pass is ${this.password}`);
        
    
    })
  
  const userModel = mongoose.model("users",userSchema)
  module.exports = userModel;