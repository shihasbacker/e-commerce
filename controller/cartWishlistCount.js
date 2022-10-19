let cartModel= require("../model/cartschema")
let wishlistModel = require('../model/wishlistSchema')

module.exports={
    getCartCount:async function(req,res){
        console.log("req.session;",req.session)
        let userId=req.session.userId
        
        let cartData =await cartModel.findOne({userId:userId}).lean()
        console.log(userId,"this is the userId formt he session");
        let cartCount=0;
        if( cartData ){
            cartCount=cartData.products.length;
            return cartCount;

        }
    },
    getWishlistCount:async function(req,res){
        let userId = req.session.userId
        
        let wishlistData=await wishlistModel.findOne({userId:userId}).lean();
        let wishlistCount=0;
        if (wishlistData){
            wishlistCount=wishlistData.products.length;
            return wishlistCount;
        }

    }
}