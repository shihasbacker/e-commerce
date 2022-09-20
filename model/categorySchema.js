const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    // category: {
    //     type: String,
    //     required:true
    // }, 
    category: String,
    subCategory: {
        type:String
    }
    
    
    
});
const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;