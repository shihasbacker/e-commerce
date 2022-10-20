let cartModel = require("../model/cartschema");
const cartFunctions = require("../controller/cartFunctions");

module.exports = {
  addToCart: async (req, res, next) => {
    try {
      const productId = req.body.productId;

      let userId = req.session.userId;

      cart = await cartModel.findOne({ userId: userId }).lean();
      if (cart) {
        productexist = await cartModel.findOne({
          userId: userId,
          "products.productId": productId,
        });
        if (productexist) {
          await cartModel.updateOne(
            { userId: userId, "products.productId": productId },
            { $inc: { "products.$.quantity": 1 } }
          );
          res.json({ message: "success" });
        } else {
          await cartModel.findOneAndUpdate(
            { userId: userId },
            { $push: { products: { productId: productId, quantity: 1 } } }
          );
          res.json({ message: "success" });
        }
      } else {
        await cartModel.create({
          userId: userId,
          products: { productId: productId, quantity: 1 },
        });
        res.json({ message: "success" });
      }
    } catch (error) {
      next(error);
    }
  },

  viewCart: async (req, res, next) => {
    try {
      let userId = req.session.userId;
      cartData = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      let totalAmount;

      if (cartData) {
        // To check whether a cart is emypty-------------------------------------------------------------------
        if (cartData.products[0]) {
          totalAmount = await cartFunctions.totalAmount(cartData);
          return res.render("user/shoppingCart", {
            cartData,
            totalAmount,
            userPartials: true,
          });
        }
        res.render("user/emptyCart", { userPartials: true });
      } else {
        res.render("user/emptyCart", { userPartials: true });
      }

      //res.render('user/shoppingCart',{cartData, totalAmount,userPartials:true})
    } catch (error) {
      next(error);
    }
  },

  changeQuantity: async (req, res, next) => {
    try {
      if (req.body.count == -1 && req.body.quantity == 1) {
        await cartModel.updateOne(
          { _id: req.body.cartId },
          {
            $pull: { products: { productId: req.body.prodId } },
          }
        );
        let cartData = await cartModel
          .findOne({ _id: req.body.cartId })
          .populate("products.productId")
          .lean();

        let totalAmount = await cartFunctions.totalAmount(cartData);

        res.json({ removeProduct: true, totalAmount });
      } else {
        await cartModel.updateOne(
          { _id: req.body.cartId, "products.productId": req.body.prodId },
          { $inc: { "products.$.quantity": req.body.count } }
        );
        let cartData = await cartModel
          .findOne({ _id: req.body.cartId })
          .populate("products.productId")
          .lean();
        let price =
          cartData.products[req.body.index].productId.price *
          cartData.products[req.body.index].quantity;
        let totalAmount = await cartFunctions.totalAmount(cartData);
        res.json({ status: true, price, totalAmount });
      }
    } catch (error) {
      next(error);
    }
  },

  removeProduct: async (req, res, next) => {
    try {
      productId = req.body.product;

      userId = req.session.userId;

      cartData = await cartModel.find({ userId: userId });
      deletes = await cartModel.updateOne(
        { userId: userId },
        { $pull: { products: { productId: req.body.product } } }
      );
      res.status(200).json({ message: "the product is successfully deleted" });
    } catch (error) {
      next(error);
    }
  },
};
