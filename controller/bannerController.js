const bannerModel = require('../model/bannerSchema');
const productModel = require('../model/productSchema');
const fs = require("fs");

module.exports = {
    renderBanner: async (req, res) => {
        let bannerData = await bannerModel.find({}).populate('product').lean()
        res.render('admin/tableBanner', { layout: 'admin-layout', bannerData })
    },
    renderEditBanner: async (req, res) => {
        let bannerId = req.params.id;
        let bannerData = await bannerModel.findOne({ _id: bannerId }).populate('product').lean()
        let productData = await productModel.find().lean()
        res.render('admin/editBanner', { layout: 'admin-layout', bannerData, productData });
    },
    editBanner: async (req, res) => {
        let bannerId = req.params.id;
        //await bannerModel.findOneAndUpdate({_id:bannerId},{$set:{heading:req.body.heading}})
        console.log("req.body from edit banenr",req.body)
        // let image = req.file
        console.log("image from edit banner:",req.file);
        if (req.file){
            imagePath= await bannerModel.findOne({ _id: req.params.id }, { _id: 0, image: 1 });
                fs.unlinkSync('public/bannerImages/'+imagePath.image);
                req.body.image = req.file.filename;
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { image: req.body.image });
            }
        if (req.body.productId) {
         
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, {  productId: req.body.productId });
            }
        if(req.body.heading){
            await bannerModel.findOneAndUpdate({ _id: req.params.id }, { heading: req.body.heading });}
        if(req.body.subHeading){
            await bannerModel.findOneAndUpdate({ _id: req.params.id }, { subHeading: req.body.subHeading });       
        }
        if(req.body.product){
            await bannerModel.findOneAndUpdate({ _id: req.params.id }, { product: req.body.product });       
        }

        res.redirect('/admin/tableBanner');
    },
    addBanner: async (req, res) => {
        //await bannerModel.create(req.body)
        let productData = await productModel.find().lean()
        res.render('admin/addBanner', { layout: 'admin-layout', productData })
    },
    addBannerButton: async (req, res) => {
        //console.log("banner req.body:",req.body);
        //console.log("banner req.files:",req.file);
        req.body.image = req.file.filename;
        await bannerModel.create(req.body);
        res.redirect('/admin/tableBanner');
    },
    deleteBanner: async (req, res) => {
        let bannerId = req.params.id;
        // await bannerModel.findOneAndDelete({ productId: productId }).lean()
        imagePath= await bannerModel.findOne({ _id: bannerId }, { _id: 0, image: 1 });
        fs.unlinkSync('public/bannerImages/'+imagePath.image);
        await bannerModel.findOneAndDelete({ _id: bannerId });
        res.redirect('/admin/tableBanner');
        
    }
}


// editBanner: async(req, res, next) => {
//     console.log(req.params.id);
//     console.log(req.file);
//     if (req.file){
//     imagePath= await bannerModel.findOne({ _id: req.params.id }, { _id: 0, image: 1 });
//         fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'bannerImages', imagePath.image));
//         req.body.image = req.file.filename;
//         await bannerModel.findOneAndUpdate({ _id: req.params.id }, { image: req.body.image });
//     }
    
//     if (req.body.productId == 'null') {
//         delete req.body.productId
//     }
    
//     else if (req.body.productId) {
         
//         await bannerModel.findOneAndUpdate({ _id: req.params.id }, {  productId: req.body.productId });
//     }
//     if(req.body.heading)
//         await bannerModel.findOneAndUpdate({ _id: req.params.id }, { heading: req.body.heading });
    
//     res.redirect('/admin/bannerData');
  
// },
// deleteBanner: async (req, res, next) => {
//     imagePath= await bannerModel.findOne({ _id: req.params.id }, { _id: 0, image: 1 });
//     fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'bannerImages', imagePath.image));
//     await bannerModel.findOneAndDelete({ _id: req.params.id });
//     res.redirect('/admin/bannerData');
// }