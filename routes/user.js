var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/userController')
const sessionCheck = require('../middlewares/session')
const cartRoutes = require('../controller/cartController')




router.get('/',sessionCheck.userSessionChecker,userRoutes.indexRoute);
router.get('/signup',userRoutes.getSignup);
router.get('/login',userRoutes.getLogin);
router.post('/registerUser',userRoutes.SignupAction);
router.post('/loginSubmit',userRoutes.LoginAction)
router.get('/logout',userRoutes.getLogout)

//product-view-page//
router.get('/quickView/:id',userRoutes.quickView)
//cart//
router.get('/viewCart/:id',sessionCheck.userSessionChecker,cartRoutes.viewCart)

//sample//
// router.get('/sample',userRoutes.sample)

module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

