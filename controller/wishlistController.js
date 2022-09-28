const { rawListeners } = require("../app");
let productModel = require("../model/productSchema")
let wishlistModel = require('../model/wishlistSchema')


// exports.wishlist=async(req,res)=>{

//     let products = await productModel.find().populate('category').lean();
//     res.render('user/wishlist',{products})
// }

module.exports={
    wishlist:async(req,res)=>{
        userId = req.session.userId
        wishlistDatas = await wishlistModel.findOne(
            {userId:userId}
       ).populate("products.productId").lean()
       console.log(wishlistDatas)

        res.render('user/wishlist',{wishlistDatas})

    },
    addWishlist:async(req,res)=>{
        let productId = req.body.product
        let userId = req.session.userId

        wishlist = await wishlistModel.findOne({userId:userId}).lean()
        if(wishlist){
            productExist = await wishlistModel.findOne({userId:userId,"products.productId":productId})
            if(productExist)
                return res.json({message:"product already added to wishlist"})
                 await wishlistModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId } } });
        }
        else{ await wishlistModel.create({userId:userId,products:{productId:productId}})}

        wishlistData = await wishlistModel.findOne(
            {userId:userId}
        ).populate("products.productId").lean()
        price = (wishlistData.products[0].productId.amount - wishlistData.products[0].productId.discount)
        console.log(price)
        await wishlistModel.updateOne({userId:userId,"products.productId":productId},{"products.$.price":price})

    }
}