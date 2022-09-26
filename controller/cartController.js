let cartModel = require("../model/cartschema");


module.exports={
    viewCart: async(req,res,next)=>{
        const productId = req.params.id
        let userId = req.session.userId;
        // console.log(userId, "this is the user id from the session that is stored");
        // console.log(productId);
        // res.render("user/shopping-cart")
        cart = await cartModel.findOne({ userId : userId._id }).lean();
        if (cart) {
            productexist = await cartModel.findOne({ userId: userId._id, "products.productId": productId });
            if (productexist) {
                await cartModel.updateOne({ userId: userId._id, "products.productId": productId }, { $inc: { "products.$.quantity": 1 } });
            }
            else {
                await cartModel.findOneAndUpdate({ userId: userId._id }, {$push:{products:{productId:productId,quantity:1}}});
            }
        }
        else { await cartModel.create({ userId: userId._id , products:{productId:productId,quantity:1}} ); }
        cartData = await cartModel.findOne(
            {userId:userId._id}
        ).populate("products.productId").lean();
       
       console.log(cartData.products[0]);
        res.render('user/shoppingCart',{cartData})

    }
}