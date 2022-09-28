var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/userController')
const sessionCheck = require('../middlewares/session')
const cartRoutes = require('../controller/cartController');
const cartController = require('../controller/cartController');
const wishlistRoutes =  require('../controller/wishlistController')


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
router.get('/wishlist',wishlistRoutes.wishlist)
router.post('/addWishlist',wishlistRoutes.addWishlist)



//errorpage//
// router.get('*',userRoutes.getErrorPage)

module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

