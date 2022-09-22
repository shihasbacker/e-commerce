var express = require('express');
var router = express.Router();



// routes details file
const userRoutes = require('../controller/userController')
const sessionCheck = require('../middlewares/session')




router.get('/',sessionCheck.userSessionChecker,userRoutes.indexRoute);
router.get('/signup',userRoutes.getSignup);
router.get('/login',userRoutes.getLogin);
router.post('/registerUser',userRoutes.SignupAction);
router.post('/loginSubmit',userRoutes.LoginAction)
router.get('/logout',userRoutes.getLogout)




module.exports = router;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('user/index', { title: 'Express' });

// });

