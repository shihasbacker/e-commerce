const adminModel = require("../model/adminSchema");
const categoryModel = require("../model/categorySchema")
const bcrypt = require('bcrypt');
const userModel = require("../model/userSchema");
const productModel = require('../model/productSchema')
const session = require("express-session");

let adminlayout = {layout:'admin-layout'}


exports.sessionChecker=function(req,res,next){
    if (req.session.loggedIn){
        next()
    }else{
        res.redirect('/admin/login')
    }
}

exports.adminIndexRoute =function(req,res,next){
    // if(req.session.loggedIn){
        res.render('admin/index',{admin:req.session.admin,layout:'admin-layout'} );
    // }else{
        // return res.redirect('/admin/login')
    // }

}

//signup page
exports.adminSignup = function(req,res,next){
    if(req.session.loggedIn){
        res.redirect('/admin')
    }else {
        res.render('admin/signup',adminlayout);
    }
}

exports.adminSignupAction=async function(req,res){
    let oldUser = await adminModel.findOne({email:req.body.email})
    if(oldUser){
        console.log("old user")
        return res.send('old user found')
    }
    let newUser = await adminModel.create(req.body)
    console.log(newUser)
    req.session.loggedIn=true;
    res.redirect("/admin")
    
}

//login page
exports.adminLogin = function(req,res,next){
    if(req.session.loggedIn){
        res.redirect('/admin')
    }else{
        res.render('admin/login',adminlayout);
    }
    
}

exports.adminLoginAction=async function(req,res){
    // console.log(req.body)
    let adminData = await adminModel.findOne({email:req.body.email})
    if(adminData) {
        // let correct = await
        let correct =await bcrypt.compare(req.body.password, adminData.password);
        // console.log(correct)
        if(correct==true){
            req.session.loggedIn = true;
            req.session.admin = adminData
            console.log(req.session.admin);
            return res.redirect('/admin')
        }else{
            res.send("password incorrect")
        }
    }
    else{
        res.send('no user found')
    }
}

/// USER DETAILS ///
exports.userDetails= async function(req,res){
    let userData = await userModel.find().lean()
    res.render('admin/userTable',{userData,layout:'admin-layout'})
}
exports.editBlock=async function(req,res){
    let userId = req.params.id
    let block = await userModel.find({_id:userId}).lean()
    console.log(block,"userdetails")
    res.render('admin/Blockform',{block,layout:'admin-layout'})
}
exports.userBlock = async function(req,res){
    let userId = req.params.id
    await userModel.updateOne({_id:userId},{block:true})
    res.redirect('/admin/userTable')
}
exports.userActive= async function(req,res){
    let userId = req.params.id
    await userModel.updateOne({_id:userId},{block:false})
    res.redirect('/admin/userTable')
}
//adminLogout
exports.adminLogout=function(req,res){
    req.session.loggedIn=false;
    res.redirect('/admin/login')
}


///CATEGORY DETAILS ///
exports.viewCategory=async function(req,res){
    let categoryData =await categoryModel.find().lean()
    res.render('admin/viewCategory',{categoryData, layout:'admin-layout'})
    // console.log(categoryData)
}
exports.addCategory=function(req,res){
    res.render('admin/addCategory',adminlayout)
}
exports.createCategory= async function(req,res){
    console.log(req.body)
    let categoryExists = await categoryModel.findOne({category:req.body.category}).lean()
    let subCategoryExists = await categoryModel.findOne({subCategory:req.body.subCategory}).lean()
    if(categoryExists && subCategoryExists){
        res.send("category or subcategory exists")
    }else{
        categoryModel.create(req.body);
        return res.redirect('/admin/viewCategory')
    }
    
}
///EDIT CATEGORY///
exports.editCategory=function(req,res){
    
    let categoryId = req.params.id;
    res.render('admin/editCategory',{categoryId,layout:'admin-layout'})

}
exports.editCategoryButton=async function(req,res){
    // console.log("params id is prr",req.params.id)
    
    await categoryModel.findOneAndUpdate({"_id":req.params.id},{$set:{"category":req.body.category,"subCategory":req.body.subCategory}})
    res.redirect('/admin/viewCategory')
}

exports.deleteCategory=async function (req, res, next) {
    // const categoryIds = req.params.id;
    await categoryModel.deleteOne({ _id: req.params.id });
    res.redirect('/admin/viewCategory');
}

// module.exports= {
//     deleteCategory:async function (req, res, next) {
//         // const categoryIds = req.params.id;
//         await categoryModel.deleteOne({ _id: req.params.id });
//         res.redirect('/admin/viewCategory');
//     }
// }


//PRODUCT 
exports.productDetails=async (req,res)=>{
    let productData =await productModel.find().lean()
    res.render('admin/viewProducts',{productData, layout:'admin-layout'})
}
exports.addProduct=function(req,res){
    res.render('admin/addProduct',{layout:'admin-layout'})
}
exports.createProduct=(req,res)=>{
    // console.log(req.body)
    productModel.create(req.body);
    res.redirect('/admin/viewProducts')
}





// module.exports = {
//     editCategoryButton: async (req,res)=>{
//         console.log("prrrr")
//         await categoryModel.findOneAndUpdate({"_id":req.params.id},{$set:{"category":req.body.category,"subCategory":req.body.subCategory}})
//         res.redirect('/admin/viewCategory');
//     },
//     deleteCategory: async (req,res)=>{
//         await categoryModel.deleteOne({ _id: req.params.id });
//         res.redirect('/admin/viewCategory');
//     }
// }