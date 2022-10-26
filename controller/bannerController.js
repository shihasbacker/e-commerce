const bannerModel = require('../model/bannerSchema');
const productModel = require('../model/productSchema');
const fs = require("fs");
const { nextTick } = require('process');

module.exports = {
    renderBanner: async (req, res, next) => {
        try {
            let bannerData = await bannerModel.find({}).populate('product').lean()
            res.render('admin/tableBanner', { layout: 'admin-layout', bannerData, adminPartials:true })
        } catch (error) {
            next(error)
        }
    },
    renderEditBanner: async (req, res, next) => {
        try {
            let bannerId = req.params.id;
            let bannerData = await bannerModel.findOne({ _id: bannerId }).populate('product').lean()
            let productData = await productModel.find().lean()
            res.render('admin/editBanner', { layout: 'admin-layout', bannerData, productData, adminPartials:true });
        } catch (error) {
            next(error)
        }
    },
    editBanner: async (req, res, next) => {
        try {
            let bannerId = req.params.id;
            if (req.file) {
                imagePath = await bannerModel.findOne({ _id: req.params.id }, { _id: 0, image: 1 });
                fs.unlinkSync('public/bannerImages/' + imagePath.image);
                req.body.image = req.file.filename;
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { image: req.body.image });
            }
            if (req.body.productId) {

                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { productId: req.body.productId });
            }
            if (req.body.heading) {
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { heading: req.body.heading });
            }
            if (req.body.subHeading) {
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { subHeading: req.body.subHeading });
            }
            if (req.body.product) {
                await bannerModel.findOneAndUpdate({ _id: req.params.id }, { product: req.body.product });
            }

            res.redirect('/admin/tableBanner');
        } catch (error) {
            next(error)
        }
    },
    addBanner: async (req, res, next) => {
        try {
            let productData = await productModel.find().lean()
            res.render('admin/addBanner', { layout: 'admin-layout', productData , adminPartials:true})
        } catch (error) {
            next(error)
        }
    },
    addBannerButton: async (req, res, next) => {
        try {
            req.body.image = req.file.filename;
            await bannerModel.create(req.body);
            res.redirect('/admin/tableBanner');
        } catch (error) {
            next(error)
        }
    },
    deleteBanner: async (req, res, next) => {
        try {
            let bannerId = req.params.id;
            imagePath = await bannerModel.findOne({ _id: bannerId }, { _id: 0, image: 1 });
            fs.unlinkSync('public/bannerImages/' + imagePath.image);
            await bannerModel.findOneAndDelete({ _id: bannerId });
            res.redirect('/admin/tableBanner');
        } catch (error) {
            next(error)
        }

    }
}

