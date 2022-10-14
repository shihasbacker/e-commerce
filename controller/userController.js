const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema")
const categoryModel = require("../model/categorySchema")
const bcrypt = require('bcrypt');
const { router } = require("../app");
const orderModel = require("../model/orderSchema");
const bannerModel = require("../model/bannerSchema");



exports.indexRoute = async function(req,res,next){
    let products = await productModel.find().populate('category').lean();
    let categoryData = await categoryModel.find().lean()
    let bannerData = await bannerModel.find().populate('product').lean()
    res.render('user/index',{products,categoryData,bannerData,userPartials:true});
}

exports.allProducts = async (req,res)=>{
    let products = await productModel.find().populate('category').lean();
    let categoryData = await categoryModel.find().lean()
    res.render('user/allProducts',{products,categoryData,userPartials:true});
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
    req.session.userId = newUser._id
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
  res.render('user/productDetail',{productDetails,userPartials:true})
}

exports.myOrders=async(req,res)=>{
    userId = req.session.userId
    let orderData = await orderModel.find({userId:userId}).populate('products.productId').lean()
    // console.log("orderData form my order:",orderData)
    //let userData = await userModel.findOne({_id:userId}).lean()
    for(let i = 0; i < orderData.length; i++) {
        if (orderData[i].status=="cancelled") {
          orderData[i].cancelled=true;
        } 
        else if (orderData[i].status=="delivered"){
            orderData[i].delivered=true;
        }
      }
    // let cancelled;
    // if(orderData.status=='cancelled')   {cancelled = true;}
    res.render('user/myOrders',{orderData,userPartials:true})
}
exports.cancelOrder=async(req,res)=>{
    userId=req.session.userId
    orderId = req.body.orderId
    //console.log("userId session:",userId);
    //console.log("orderId ajax:",orderId);
    await orderModel.findOneAndUpdate({_id:orderId},{$set:{status:'cancelled'}})
    res.json({status: "success"})
}

// exports.sample=(req,res)=>{
//     res.render('user/product-detail')
// }



// exports.userDatatoDBRoute= function(req,res){
//     userDetailsInsert(req.body);
//     console.log("data entered to db");
// }