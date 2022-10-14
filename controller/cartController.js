let cartModel = require("../model/cartschema");
const cartFunctions = require('../controller/cartFunctions');

module.exports={
    addToCart: async(req,res,next)=>{
        const productId = req.params.id
        let userId = req.session.userId;
        // console.log(userId, "this is the user id from the session that is stored");
        // console.log(productId);
        // res.render("user/shopping-cart")
        cart = await cartModel.findOne({ userId : userId}).lean();
        if (cart) {
            productexist = await cartModel.findOne({ userId: userId, "products.productId": productId });
            if (productexist) {
                await cartModel.updateOne({ userId: userId, "products.productId": productId }, { $inc: { "products.$.quantity": 1 } });
            }
            else {
                await cartModel.findOneAndUpdate({ userId: userId }, {$push:{products:{productId:productId,quantity:1}}});
            }
        }
        else { await cartModel.create({ userId: userId, products:{productId:productId,quantity:1}} ); }

        

    },

    viewCart:async(req,res)=>{
        let userId = req.session.userId;
        cartData = await cartModel.findOne(
            {userId:userId}
        ).populate("products.productId").lean();
        console.log('cart data is:',cartData)
        let totalAmount;
        if(cartData)  {totalAmount = await cartFunctions.totalAmount(cartData);}
        res.render('user/shoppingCart',{cartData, totalAmount,userPartials:true})
    },
    
       
        
        // console.log('success');
        // totalAmount = await cartFunctions.totalAmount(cartData)
        
        // console.log(totalAmount);
        // return res.json({ message: 'ethi', quantity, totalAmount })
        //stock = await productModel.findOne({ _id: req.body.product}, { _id: 0, stock: 1 }).lean();
        // if (stock.stock<=0) {
        //  return res.json({message:'sorry the product is out of stock click the link below to move back to cart'})            
        // }

        
    incrementValue:async(req,res)=>{
        const quantities = parseInt(req.body.quantity)
       
        userId = req.session.userId;
         await cartModel.updateOne({ userId: userId, "products.productId": req.body.product },  { "products.$.quantity": quantities });
         cartData = await cartModel.findOne(
            { userId: userId, "products.productId": req.body.product}
        ).populate("products.productId").lean();
        price = (cartData.products[req.body.index].productId.amount - cartData.products[req.body.index].productId.discount) * cartData.products[req.body.index].quantity
        quantity = cartData.products[req.body.index].quantity;
        
        totalAmount = await cartFunctions.totalAmount(cartData);
        return res.json({ message: "the product is incremented",quantity,price, totalAmount })
    },
    
    removeProduct: async (req, res, next) => {
        productId = req.body.product
       
        userId = req.session.userId
        console.log(req.body.product)
       
        cartData = await cartModel.find({ userId: userId })
        console.log(cartData);
        deletes = await cartModel.updateOne({ userId: userId }, { $pull: { products: { productId: req.body.product } } })
        console.log(deletes);
        console.log('delete');
        res.status(200).json({ message: "the product is successfully deleted" });
    }
      
}