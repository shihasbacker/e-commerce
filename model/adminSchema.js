const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    name: String,
    // email:{
    //   type: String,
    //   unique: true
    // },
    email: String,

    password: String,

  });

    adminSchema.pre("save", async function(){
        
        // console.log(`the current pass is ${this.password}`);
        this.password= await bcrypt.hash(this.password,10)
        // console.log(`the current pass is ${this.password}`);
        
    
    })
  
  const adminModel = mongoose.model("admin", adminSchema)
  module.exports = adminModel;