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
router.get('/viewProducts',sessionCheck.adminSessionChecker,adminRoutes.productDetails)
router.get('/addProduct',sessionCheck.adminSessionChecker,adminRoutes.addProduct)
router.post('/addProduct',upload.array('photos', 4),adminRoutes.createProduct)
router.get('/viewEditProduct/:id',sessionCheck.adminSessionChecker,adminRoutes.viewEditProduct)
router.post('/editProduct/:id',upload.array('photos', 4),adminRoutes.editProduct)
router.get('/deleteProduct/:id',sessionCheck.adminSessionChecker,adminRoutes.deleteProduct)

router.get('/orders',sessionCheck.adminSessionChecker,adminRoutes.orders)
router.get('/editStatus/:id',sessionCheck.adminSessionChecker,adminRoutes.editStatus)
router.post('/editStatusButton/:id',adminRoutes.editStatusButton);

//banner//
router.get('/tableBanner',sessionCheck.adminSessionChecker,bannerRoutes.renderBanner)
router.get('/viewEditBanner/:id',sessionCheck.adminSessionChecker,bannerRoutes.renderEditBanner);
router.post('/editBanner/:id',uploads.single('image'),bannerRoutes.editBanner);
router.get('/addBanner',sessionCheck.adminSessionChecker,bannerRoutes.addBanner)
router.post('/addBanner',uploads.single('image'),bannerRoutes.addBannerButton)
router.get('/deleteBanner/:id',sessionCheck.adminSessionChecker,bannerRoutes.deleteBanner)

//coupon//
router.get('/viewCoupon',sessionCheck.adminSessionChecker,couponRoutes.couponTable)
router.get('/addCoupon',sessionCheck.adminSessionChecker,couponRoutes.renderAddCoupon)
router.post('/addCoupon',couponRoutes.addCoupon)
router.get('/editCoupon/:id',sessionCheck.adminSessionChecker,couponRoutes.renderEditCoupon)
router.post('/editCoupon/:id',couponRoutes.editCoupon);
router.get('/deleteCoupon/:id',sessionCheck.adminSessionChecker,couponRoutes.deleteCoupon)

router.get('/salesReport',sessionCheck.adminSessionChecker,sessionCheck.adminSessionChecker,adminRoutes.salesReport);
// router.use((req,res,next) => {
//     next(createError(404))
//   })
  
//   router.use((err,req,res,next) => {
//     console.log("admin error route handler");
//     res.status(err.status || 500);
//     res.render('admin/adminError')
//   })


router.use((req,res,next) => {
    //next(createError(404))
    res.render("admin/error")
})

router.use((err,req,res,next) => {
    console.log("admin error route handler");
    res.status(err.status || 500);
    res.render('admin/adminError')
})

// router.get('*',adminRoutes.getErrorPage)
module.exports = router;


/* GET users listing. */

// router.get('/login', function(req, res, next) {
//   res.render('admin/login', {layout:'admin-layout'})
// });

