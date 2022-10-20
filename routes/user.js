var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/userController')
const sessionCheck = require('../middlewares/session')
const cartRoutes = require('../controller/cartController');
const cartController = require('../controller/cartController');
const wishlistRoutes =  require('../controller/wishlistController')
const userProfile = require('../controller/userProfileController')
const checkoutRoutes = require('../controller/checkoutController')
const orderRoutes = require('../controller/orderController');
const razorpayController = require('../controller/razorpayController');
const orderController = require('../controller/orderController');
const couponRoutes = require('../controller/couponController');



router.get('/',sessionCheck.userSessionChecker,userRoutes.indexRoute);
router.get('/allProducts',userRoutes.allProducts)
router.get('/signup',userRoutes.getSignup);
router.get('/login',userRoutes.getLogin);
router.post('/registerUser/',userRoutes.SignupAction);
router.post('/loginSubmit',userRoutes.LoginAction)
router.get('/logout',userRoutes.getLogout)

//router.get('/otp',sessionCheck.userSessionChecker,userRoutes.otpVerify)
router.post('/otp/:id',userRoutes.postOtp)

//product-view-page//
router.get('/quickView/:id',sessionCheck.userSessionChecker,userRoutes.quickView)
//cart//

router.post('/addToCart',sessionCheck.userSessionChecker,cartRoutes.addToCart)
router.get('/viewCart',sessionCheck.userSessionChecker,cartRoutes.viewCart)

router.post('/changeQuantity',sessionCheck.userSessionChecker,cartRoutes.changeQuantity)
router.post('/removeProduct',sessionCheck.userSessionChecker,cartRoutes.removeProduct)


//wishlist//
router.get('/wishlist',sessionCheck.userSessionChecker,wishlistRoutes.wishlist)
router.post('/addWishlist',sessionCheck.userSessionChecker,wishlistRoutes.addWishlist)
router.post('/deleteWishlist',sessionCheck.userSessionChecker,wishlistRoutes.delete)


router.get('/userDetails',sessionCheck.userSessionChecker,userProfile.userProfile)
router.patch('/changeUsername',sessionCheck.userSessionChecker,userProfile.changeUsername)
router.patch('/changePassword',sessionCheck.userSessionChecker,userProfile.changePassword)
router.get('/addAddress',sessionCheck.userSessionChecker,userProfile.addAddress)
router.post('/submitAddress',sessionCheck.userSessionChecker,userProfile.submitAddress)
router.post('/deleteAddress',userProfile.deleteAddress)
router.post('/editAddress/:id',userProfile.editAddress)


router.get('/checkout',sessionCheck.userSessionChecker,checkoutRoutes.checkoutPage)
router.post('/billingAddress',sessionCheck.userSessionChecker,checkoutRoutes.billingAddress)
router.post('/confirmOrderButton',sessionCheck.userSessionChecker,orderRoutes.confirmOrderButton)

router.post('/verifyRazorpay', sessionCheck.userSessionChecker, orderController.verifyPay);
router.get('/renderConfirmation', sessionCheck.userSessionChecker, orderController.confirmationPage) 

router.get('/myOrders',sessionCheck.userSessionChecker,userRoutes.myOrders)
router.post('/cancelOrder',sessionCheck.userSessionChecker,userRoutes.cancelOrder)

router.post('/couponValidation',sessionCheck.userSessionChecker,couponRoutes.validateCoupon)

module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

