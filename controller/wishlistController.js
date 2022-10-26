const { rawListeners } = require("../app");
let productModel = require("../model/productSchema")
let wishlistModel = require('../model/wishlistSchema')

module.exports = {
    wishlist: async (req, res, next) => {
        try {
            userId = req.session.userId
            wishlistDatas = await wishlistModel.findOne(
                { userId: userId }
            ).populate("products.productId").lean()

            res.render('user/wishlist', { wishlistDatas , userPartials:true})
        } catch (error) {
            next(error)
        }

    },
    addWishlist: async (req, res, next) => {
        try {
            let productId = req.body.product
            let userId = req.session.userId

            wishlist = await wishlistModel.findOne({ userId: userId }).lean()
            if (wishlist) {
                productExist = await wishlistModel.findOne({ userId: userId, "products.productId": productId })
                if (productExist)
                    return res.json({ message: "product already added to wishlist" })
                await wishlistModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId } } });
            }
            else { await wishlistModel.create({ userId: userId, products: { productId: productId } }) }

            wishlistData = await wishlistModel.findOne(
                { userId: userId }
            ).populate("products.productId").lean()
            price = (wishlistData.products[0].productId.amount - wishlistData.products[0].productId.discount)
            await wishlistModel.updateOne({ userId: userId, "products.productId": productId }, { "products.$.price": price })

        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            productId = req.body.product
            userId = req.session.userId
            deletes = await wishlistModel.updateOne({ userId: userId }, { $pull: { products: { productId: req.body.product } } })
            res.json({})
        } catch (error) {
            next(error)
        }
    }
}