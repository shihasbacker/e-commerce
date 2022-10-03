var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/userController')
const sessionCheck = require('../middlewares/session')
const cartRoutes = require('../controller/cartController');
const cartController = require('../controller/cartController');
const wishlistRoutes =  require('../controller/wishlistController')
const userProfile = require('../controller/userProfileController')


router.get('/',sessionCheck.userSessionChecker,userRoutes.indexRoute);
router.get('/signup',userRoutes.getSignup);
router.get('/login',userRoutes.getLogin);
router.post('/registerUser',userRoutes.SignupAction);
router.post('/loginSubmit',userRoutes.LoginAction)
router.get('/logout',userRoutes.getLogout)

//product-view-page//
router.get('/quickView/:id',sessionCheck.userSessionChecker,userRoutes.quickView)
//cart//

router.get('/addToCart/:id',sessionCheck.userSessionChecker,cartRoutes.addToCart)
router.get('/viewCart',sessionCheck.userSessionChecker,cartRoutes.viewCart)

router.post('/incrementValue',cartRoutes.incrementValue)
router.post('/removeProduct',cartRoutes.removeProduct)


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
//errorpage//
// router.get('*',userRoutes.getErrorPage)

module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

