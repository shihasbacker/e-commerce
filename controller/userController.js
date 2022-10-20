const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema")
const categoryModel = require("../model/categorySchema")
const bcrypt = require('bcrypt');
const { router } = require("../app");
const orderModel = require("../model/orderSchema");
const bannerModel = require("../model/bannerSchema");
const twilioController = require('../controller/twilioController')
const count = require('../controller/cartWishlistCount')

exports.indexRoute = async function (req, res, next) {
    try {
        let products = await productModel.find().populate('category').lean();
        let categoryData = await categoryModel.find().lean()
        let bannerData = await bannerModel.find().populate('product').lean()
        let cartCount = await count.getCartCount(req, res);
        let wishlistCount = await count.getWishlistCount(req, res)
        res.render('user/index', { products, categoryData, bannerData, cartCount, wishlistCount, userPartials: true });
    } catch (error) {
        next(error)
    }
}

exports.allProducts = async (req, res, next) => {
    try {
        let products = await productModel.find().populate('category').lean();
        let categoryData = await categoryModel.find().lean()
        res.render('user/allProducts', { products, categoryData, userPartials: true });
    } catch (error) {
        next(error)
    }
}

//signup page
exports.getSignup = function (req, res, next) {
    try {
        if (req.session.userLogin) res.redirect('/')
        else res.render('user/signup');
    } catch (error) {
        next(error)
    }
}

exports.SignupAction = async function (req, res, next) {
    try {
        let oldUser = await userModel.findOne({ email: req.body.email })
        if (oldUser) {
            return res.send('old user found')
        }
        let newUser = await userModel.create(req.body)
        // console.log(newUser)
        // req.session.userLogin = true;
        // req.session.userId = newUser._id
        // res.redirect("/")

        twilioController.sendOtp(newUser)

        let id = newUser._id
        res.render('user/otp', { id })
    } catch (error) {
        next(error)
    }


}
exports.postOtp = async function (req, res, next) {

    try {
        const userdata = await userModel.findOne({ _id: req.params.id }).lean();
        let otps = req.body.otp;
        let verification = await twilioController.verifyOtp(otps, userdata);
        if (verification) {

            req.session.userLogin = true;
            req.session.userId = userdata._id;
            res.redirect('/');
        }
        else {
            await userModel.findOneAndDelete({ _id: req.params.id }).lean();
            res.redirect('/signup')
        }
    } catch (error) {
        next(error)
    }
}

//login page
exports.getLogin = function (req, res, next) {
    try {
        if (req.session.userLogin) {
            res.redirect('/')
        } else res.render('user/userLogin');
    } catch (error) {
        next(error)
    }
}

exports.LoginAction = async function (req, res, next) {
    try {
        let userData = await userModel.findOne({ email: req.body.email })


        if (userData) {
            if (userData.block == true) res.send("you are blocked by admin")

            else {
                let correct = await bcrypt.compare(req.body.password, userData.password);
                if (correct == true) {
                    req.session.userLogin = true;
                    req.session.userId = userData._id
                    return res.redirect('/')
                }
                else res.send("password incorrect")
            }
        }
        else {
            res.send('no user found')
        }
    } catch (error) {
        next(error)
    }
}
exports.getLogout = function (req, res, next) {
    try {
        req.session.userLogin = false;

        res.redirect('/login')
    } catch (error) {
        next(error)
    }
}

exports.quickView = async (req, res, next) => {
    try {
        productId = req.params.id
        let productDetails = await productModel.findOne({ _id: productId }).lean()
        let cartCount = await count.getCartCount(req, res);
        let wishlistCount = await count.getWishlistCount(req, res)
        res.render('user/productDetail', { productDetails, cartCount, wishlistCount, userPartials: true })
    } catch (error) {
        next(error)
    }
}

exports.myOrders = async (req, res, next) => {
    try {
        userId = req.session.userId
        let orderData = await orderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('products.productId').lean()
        for (let i = 0; i < orderData.length; i++) {
            if (orderData[i].status == "cancelled") {
                orderData[i].cancelled = true;
            }
            else if (orderData[i].status == "delivered") {
                orderData[i].delivered = true;
            }
        }

        res.render('user/myOrders', { orderData, userPartials: true })
    } catch (error) {
        next(error)
    }
}
exports.cancelOrder = async (req, res, next) => {
    try {
        userId = req.session.userId
        orderId = req.body.orderId
        await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: 'cancelled' } })
        res.json({ status: "success" })
    } catch (error) {
        next(error)
    }
}
