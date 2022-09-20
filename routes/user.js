var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/user-controller')




router.get('/',userRoutes.sessionChecker,userRoutes.indexRoute);
router.get('/signup',userRoutes.getSignup);
router.get('/login',userRoutes.getLogin);
router.post('/register-user',userRoutes.SignupAction);
router.post('/login-submit',userRoutes.LoginAction)
router.get('/logout',userRoutes.getLogout)




module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

