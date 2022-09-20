var express = require('express');
var router = express.Router();



// routes details file
const adminRoutes = require('../controller/admin-controller');
const adminModel = require('../model/adminSchema');



//index//
router.get('/',adminRoutes.sessionChecker,adminRoutes.adminIndexRoute);

//signup//
router.get('/signup',adminRoutes.adminSignup);
router.get('/login',adminRoutes.adminLogin);
router.post('/adminSignup',adminRoutes.adminSignupAction);
router.post('/adminLogin',adminRoutes.adminLoginAction)
router.get('/logout',adminRoutes.adminLogout)

//user//
router.get('/userTable',adminRoutes.userDetails)
router.get('/edit/:id',adminRoutes.sessionChecker,adminRoutes.editBlock)
router.get('/block/:id',adminRoutes.sessionChecker,adminRoutes.userBlock)
router.get('/active/:id',adminRoutes.sessionChecker,adminRoutes.userActive)

//category//
router.get('/viewCategory',adminRoutes.sessionChecker,adminRoutes.viewCategory)
router.get('/addCategory',adminRoutes.sessionChecker,adminRoutes.addCategory)
router.post('/createCategory',adminRoutes.sessionChecker,adminRoutes.createCategory)
router.get('/editCategory/:id',adminRoutes.sessionChecker,adminRoutes.editCategory)
router.post('/editCategory/:id',adminRoutes.sessionChecker,adminRoutes.editCategoryButton)
router.get('/deleteCategory/:id',adminRoutes.sessionChecker, adminRoutes.deleteCategory);

//product//
router.get('/viewProducts',adminRoutes.productDetails)
router.get('/addProduct',adminRoutes.addProduct)
router.post('/addProduct',adminRoutes.createProduct)



module.exports = router;


/* GET users listing. */

// router.get('/login', function(req, res, next) {
//   res.render('admin/login', {layout:'admin-layout'})
// });

