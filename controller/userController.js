const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema")
const categoryModel = require("../model/categorySchema")
const bcrypt = require('bcrypt');
const { router } = require("../app");



exports.indexRoute = async function(req,res,next){
    let products = await productModel.find().populate('category').lean();
   
    res.render('user/index',{products});
}

//signup page
exports.getSignup = function(req,res,next){
    if(req.session.userLogin) res.redirect('/')
    else res.render('user/signup');
}

exports.SignupAction= async function(req,res){
    let oldUser = await userModel.findOne({email:req.body.email})
    if(oldUser){
        console.log("old user")
        return res.send('old user found')
    }
    let newUser = await userModel.create(req.body)
    console.log(newUser)
    req.session.userLogin = true;
    res.redirect("/")
}

//login page
exports.getLogin = function(req,res,next){
    if(req.session.userLogin){
        res.redirect('/')
    }else res.render('user/userLogin');
}

exports.LoginAction=async function(req,res){
    let userData = await userModel.findOne({email:req.body.email})
       
    if(userData) {
        if(userData.block==true) res.send("you are blocked by admin")

        else{
        let correct =await bcrypt.compare(req.body.password, userData.password);
        // console.log(correct)
        if(correct==true){
            req.session.userLogin = true;
            req.session.userId = userData._id
            console.log(req.session) 
            return res.redirect('/')
        } 
        else res.send("password incorrect")
        }
    }
    else{
        res.send('no user found')
    }
}
exports.getLogout=function(req,res){
    req.session.userLogin=false;
    res.redirect('/login')
}

exports.quickView=async(req,res)=>{
  productId = req.params.id
  let productDetails = await productModel.findOne({_id:productId}).lean()
  res.render('user/productDetail',{productDetails})
}



// exports.sample=(req,res)=>{
//     res.render('user/product-detail')
// }



// exports.userDatatoDBRoute= function(req,res){
//     userDetailsInsert(req.body);
//     console.log("data entered to db");
// }