const mongoose = require('mongoose')
const couponModel = require('../model/couponSchema')

module.exports={
    couponTable:async(req,res)=>{
        let couponData = await couponModel.find().lean()
        res.render('admin/couponTable',{layout:'admin-layout',couponData});
    },
    renderAddCoupon: (req,res)=>{
        res.render('admin/addCoupon',{layout:'admin-layout'})
    },
    addCoupon:async(req,res)=>{
        console.log(req.body);
        couponNameExist = await couponModel.find({ couponName: req.body.couponName }).lean();
       // console.log(couponNameExist,'234567890');
        couponCodeExist = await couponModel.find({ couponCode: req.body.couponCode }).lean();
        //console.log(couponCodeExist)
        if(couponNameExist[0] || couponCodeExist[0])
        return res.json({ message: "the coupon already exist" });
        await couponModel.create(req.body);
        res.redirect('/admin/viewCoupon');
    },
    renderEditCoupon:async(req,res)=>{
        id = req.params.id;
        couponData = await couponModel.find({ _id: id }).lean();
        couponData[0].expiryDate = couponData[0].expiryDate.toISOString().substring(0, 10);
        // console.log( couponData[0].expiryDate);
        // console.log(couponData);
        couponData = couponData[0];
        res.render('admin/editCoupon',{layout:'admin-layout',couponData});
    },
    editCoupon:async(req,res)=>{
        // console.log('edit coupon is :',req.body)
        // console.log('params.id :',req.params.id)
        id = req.params.id;
        await couponModel.findOneAndUpdate({ _id: id }, { $set: { couponName:req.body.couponName,discountAmount:req.body.discountAmount,minAmount:req.body.minAmount,expiryDate:req.body.expiryDate,couponCode:req.body.couponCode} })
        res.redirect('/admin/viewCoupon');
    },
    deleteCoupon: async (req, res, next) => {

        await couponModel.deleteOne({ _id: req.params.id });
        res.redirect('/admin/viewCoupon');
        
    },
    validateCoupon: async (req, res, next) => {
        userId = req.session.userId;
        //console.log("req.body form validate coupon:", req.body)
       // console.log('couponId:',req.body.couponId,"total Amount:",req.body.total)
       
        couponExist = await couponModel.findOne({couponCode:req.body.couponId,users: userId }).lean();
        
        coupons = await couponModel.findOne({ couponCode: req.body.couponId }).lean();
       // console.log(coupons,"yewfrhihdfshkhsdf");
        currentDate = new Date();
  
        if (coupons) {
        if(couponExist){
         
            return res.json({ message: 'used already' });    
        }
        if (currentDate > coupons.expiryDate) 
        return res.json({ message: "coupon expired" });   
        
         
    //    console.log(typeof(req.body.total));
    //    console.log(typeof(coupons.minAmount))
         if (Number(req.body.total) < Number(coupons.minAmount)){
         return res.json({ message: "less than minimum" });
         }
      
         //await couponModel.findOneAndUpdate({ couponCode: req.body.couponId }, { users: { userId: userId } });
           
            couponTotal = req.body.total - coupons.discountAmount;
            req.session.coupon = coupons;
           return res.json({ message: "succesfull" ,coupons,couponTotal});
        }
        return res.json({ message: "invalid coupon" });
      }

}
