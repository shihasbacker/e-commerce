var express = require('express');
var router = express.Router();
const multer = require('multer');


// routes details file
const adminRoutes = require('../controller/adminController');
const sessionCheck = require('../middlewares/session')
const bannerRoutes = require('../controller/bannerController')
const couponRoutes = require('../controller/couponController');
const cartController = require('../controller/cartController');


//multer//
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/productImageUploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,uniqueSuffix + '-' +file.originalname   )
    }
});
const upload = multer({ storage: storage });
// --------------------------------------------------------------------------------------------------------------------------
const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/bannerImages');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        ;
        cb(null,uniqueSuffix + '-' +file.originalname   )
    }
});
const uploads = multer({ storage: storages });

//index//
router.get('/',sessionCheck.adminSessionChecker,adminRoutes.adminIndexRoute);

//signup//
router.get('/signup',adminRoutes.adminSignup);
router.get('/login',adminRoutes.adminLogin);
router.post('/adminSignup',adminRoutes.adminSignupAction);
router.post('/adminLogin',adminRoutes.adminLoginAction)
router.get('/logout',adminRoutes.adminLogout)

//user//
router.get('/userTable',adminRoutes.userDetails)
router.get('/edit/:id',sessionCheck.adminSessionChecker,adminRoutes.editBlock)
router.get('/block/:id',sessionCheck.adminSessionChecker,adminRoutes.userBlock)
router.get('/active/:id',sessionCheck.adminSessionChecker,adminRoutes.userActive)

//category//
router.get('/viewCategory',sessionCheck.adminSessionChecker,adminRoutes.viewCategory)
router.get('/addCategory',sessionCheck.adminSessionChecker,adminRoutes.addCategory)
router.post('/createCategory',sessionCheck.adminSessionChecker,adminRoutes.createCategory)
router.get('/editCategory/:id',sessionCheck.adminSessionChecker,adminRoutes.editCategory)
router.post('/editCategory/:id',sessionCheck.adminSessionChecker,adminRoutes.editCategoryButton)
router.get('/deleteCategory/:id',sessionCheck.adminSessionChecker, adminRoutes.deleteCategory);

//product//
router.get('/viewProducts',adminRoutes.productDetails)
router.get('/addProduct',adminRoutes.addProduct)
router.post('/addProduct',upload.array('photos', 4),adminRoutes.createProduct)
router.get('/viewEditProduct/:id',adminRoutes.viewEditProduct)
router.post('/editProduct/:id',upload.array('photos', 4),adminRoutes.editProduct)
router.get('/deleteProduct/:id',adminRoutes.deleteProduct)

router.get('/orders',adminRoutes.orders)
router.get('/editStatus/:id',adminRoutes.editStatus)
router.post('/editStatusButton/:id',adminRoutes.editStatusButton);

//banner//
router.get('/tableBanner',bannerRoutes.renderBanner)
router.get('/viewEditBanner/:id',bannerRoutes.renderEditBanner);
router.post('/editBanner/:id',uploads.single('image'),bannerRoutes.editBanner);
router.get('/addBanner',bannerRoutes.addBanner)
router.post('/addBanner',uploads.single('image'),bannerRoutes.addBannerButton)
router.get('/deleteBanner/:id',bannerRoutes.deleteBanner)

//coupon//
router.get('/viewCoupon',couponRoutes.couponTable)
router.get('/addCoupon',couponRoutes.renderAddCoupon)
router.post('/addCoupon',couponRoutes.addCoupon)
router.get('/editCoupon/:id',couponRoutes.renderEditCoupon)
router.post('/editCoupon/:id',couponRoutes.editCoupon);
router.get('/deleteCoupon/:id',couponRoutes.deleteCoupon)

// router.get('*',adminRoutes.getErrorPage)
module.exports = router;


/* GET users listing. */

// router.get('/login', function(req, res, next) {
//   res.render('admin/login', {layout:'admin-layout'})
// });

