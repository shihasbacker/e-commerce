const adminModel = require("../model/adminSchema");
const categoryModel = require("../model/categorySchema");
const bcrypt = require("bcrypt");
const userModel = require("../model/userSchema");
const productModel = require("../model/productSchema");
const session = require("express-session");
const orderModel = require('../model/orderSchema');

const fs = require("fs");
const path = require("path");
const { findOne } = require("../model/addressSchema");

let adminlayout = { layout: "admin-layout" };

exports.adminIndexRoute =async function (req, res, next) {
  let delivered = await orderModel.find({status:'delivered'},{status:1,_id:0}).lean()
        console.log(delivered,"delivereddd dd cosanui ==");
  let deliveredCount = delivered.length
  let shipped = await orderModel.find({status:'shipped'},{status:1,_id:0}).lean()
  let shippedCount = shipped.length
  let cancelled = await orderModel.find({status:'cancelled'},{status:1,_id:0}).lean()
  let cancelledCount = cancelled.length
  let placed = await orderModel.find({status:'placed'},{status:1,_id:0}).lean()
  let placedCount = placed.length

  let orderData = await orderModel.find().populate('products.productId').lean()
  //  console.log(orderData,"orderData shhas")
    const deliveredOrder = orderData.filter(e=>e.status=='delivered')
   // console.log("delivered Order shihas",deliveredOrder);
    const TotalRevenue = deliveredOrder.reduce((accr,crr)=>accr+crr.grandTotal,0)
  //  console.log(TotalRevenue,"total revenue shihas");

    const eachDaySale = await orderModel.aggregate([{$match:{status:"delivered"}},{$group: {_id: {day: {$dayOfMonth: "$createdAt"},month: {$month: "$createdAt"}, year:{$year: "$createdAt"}},total: {$sum: "$grandTotal"}}}]).sort({_id: -1})
   console.log('eachDay sale:',eachDaySale)
   let today=new Date()
   console.log(today,":today");
  //  let day{day}
  //  let todayRevenue = eachDaySale.aggregate([{$match:{}}])
 // console.log('delivered count::',deliveredCount);
  res.render("admin/index", {
    admin: req.session.admin,
    layout: "admin-layout", deliveredCount,shippedCount,cancelledCount,placedCount,TotalRevenue,eachDaySale
  });
};

//signup page
exports.adminSignup = function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin");
  } else {
    res.render("admin/signup", adminlayout);
  }
};

exports.adminSignupAction = async function (req, res) {
  let oldUser = await adminModel.findOne({ email: req.body.email });
  if (oldUser) {
    console.log("old user");
    return res.send("old user found");
  }
  let newUser = await adminModel.create(req.body);
  console.log(newUser);
  req.session.loggedIn = true;
  res.redirect("/admin");
};

//login page
exports.adminLogin = function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin");
  } else {
    res.render("admin/login", adminlayout);
  }
};

exports.adminLoginAction = async function (req, res) {
  // console.log(req.body)
  let adminData = await adminModel.findOne({ email: req.body.email });
  if (adminData) {
    // let correct = await
    let correct = await bcrypt.compare(req.body.password, adminData.password);
    // console.log(correct)
    if (correct == true) {
      req.session.loggedIn = true;
      req.session.admin = adminData;
      console.log(req.session.admin);
      return res.redirect("/admin");
    } else {
      res.send("password incorrect");
    }
  } else {
    res.send("no user found");
  }
};

/// USER DETAILS ///
exports.userDetails = async function (req, res) {
  let userData = await userModel.find().lean();
  res.render("admin/userTable", { userData, layout: "admin-layout" });
};
exports.editBlock = async function (req, res) {
  let userId = req.params.id;
  let block = await userModel.find({ _id: userId }).lean();
  console.log(block, "userdetails");
  res.render("admin/Blockform", { block, layout: "admin-layout" });
};
exports.userBlock = async function (req, res) {
  let userId = req.params.id;
  await userModel.updateOne({ _id: userId }, { block: true });
  res.redirect("/admin/userTable");
};
exports.userActive = async function (req, res) {
  let userId = req.params.id;
  await userModel.updateOne({ _id: userId }, { block: false });
  res.redirect("/admin/userTable");
};
//adminLogout
exports.adminLogout = function (req, res) {
  req.session.loggedIn = false;
  res.redirect("/admin/login");
};

///CATEGORY DETAILS ///
exports.viewCategory = async function (req, res) {
  let categoryData = await categoryModel.find().lean();
  res.render("admin/viewCategory", { categoryData, layout: "admin-layout" });
  // console.log(categoryData)
};
exports.addCategory = function (req, res) {
  res.render("admin/addCategory", adminlayout);
};
exports.createCategory = async function (req, res) {
  console.log(req.body);
  let categoryExists = await categoryModel
    .findOne({ category: req.body.category })
    .lean();
  // let subCategoryExists = await categoryModel.findOne({subCategory:req.body.subCategory}).lean()
  if (categoryExists) {
    res.send("category exists");
  } else {
    categoryModel.create(req.body);
    return res.redirect("/admin/viewCategory");
  }
};
///EDIT CATEGORY///
exports.editCategory = function (req, res) {
  let categoryId = req.params.id;
  res.render("admin/editCategory", { categoryId, layout: "admin-layout" });
};
exports.editCategoryButton = async function (req, res) {
  // console.log("params id is prr",req.params.id)

  await categoryModel.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { category: req.body.category } }
  ); //,"subCategory":req.body.subCategory
  res.redirect("/admin/viewCategory");
};

exports.deleteCategory = async function (req, res, next) {
  // const categoryIds = req.params.id;
  await categoryModel.deleteOne({ _id: req.params.id });
  res.redirect("/admin/viewCategory");
};

// module.exports= {
//     deleteCategory:async function (req, res, next) {
//         // const categoryIds = req.params.id;
//         await categoryModel.deleteOne({ _id: req.params.id });
//         res.redirect('/admin/viewCategory');
//     }
// }

//PRODUCT
exports.productDetails = async (req, res) => {
  let productData = await productModel.find().populate('category').lean();
  res.render("admin/viewProducts", { productData, layout: "admin-layout" });
};
exports.addProduct = async function (req, res) {
  const categoryData = await categoryModel.find().lean();
  res.render("admin/addProduct", { categoryData, layout: "admin-layout" });
};
exports.createProduct = async (req, res) => {
  console.log(req.body);
  let productNames = await productModel.findOne({ name: req.body.name }).lean();
  console.log(productNames);
  if (productNames) return res.send("product already exists");
  console.log(req.files);
  const arrImages = req.files.map((value) => value.filename);
  console.log(arrImages);
  req.body.imagepath = arrImages;
  console.log(req.body);
  // console.log(req.body)
  await productModel.create(req.body);
  res.redirect("/admin/viewProducts");
};
exports.viewEditProduct = async (req, res) => {
  editId = req.params.id;
  console.log("params id: ", req.params.id);
  let productData = await productModel.findOne({ _id: editId }).lean();
  let categoryData = await categoryModel.find().lean();
  console.log(categoryData);
  res.render("admin/editProduct", {
    productData,
    categoryData,
    layout: "admin-layout",
  });
};
exports.editProduct = async (req, res) => {
    // console.log('king bekkar');
  let arrImages = req.files.map((value) => value.filename);
  console.log(arrImages);
  if (arrImages[0]) {
    imagepat = await productModel
      .findOne({ "_id:": req.params.id }, { imagepath: 1, _id: 0 })
      .lean();
    console.log(imagepat);
    //imagepat.imagepath.map((i) => fs.unlinkSync('public/productImageUploads/'+i));
    req.body.imagepath = arrImages;
    await productModel.findOneAndUpdate(
      { "_id": req.params.id },
      {
        $set: { "name": req.body.name , "brandName": req.body.brandName,'description':req.body.description,'category':req.body.category,'stock':req.body.stock,'amount':req.body.amount,'discount':req.body.discount,'imagepath':req.body.imagepath},
      }
    );
  } else {
    await productModel.findOneAndUpdate(
      { "_id": req.params.id },
      {
        $set: { "name": req.body.name , "brandName": req.body.brandName,'description':req.body.description,'category':req.body.category,'stock':req.body.stock,'amount':req.body.amount,'discount':req.body.discount} 
      }
    );
  }
  res.redirect('/admin/viewProducts');    
};
exports.deleteProduct=async(req,res)=>{
  console.log("delete product")
  await productModel.findOneAndDelete({"_id":req.params.id},{$set:{"name":req.body.name,"brandName":req.body.brandName,"description":req.body.description,"category":req.body.category,"stock":req.body.stock,"amount":req.body.amount,"discount":req.body.discount,"imagepath":req.body.imagepath}})
  res.redirect('/admin/viewProducts')
}
exports.orders=async(req,res)=>{
  let orderData = await orderModel.find().sort({createdAt:-1}).populate('userId').lean()
  
  res.render('admin/orders',{layout: false,orderData })
}
exports.editStatus= async (req,res)=>{
  let orderId = req.params.id
  //console.log("this is order id in params::",id);
  let orderData = await orderModel.findOne({_id:orderId}).lean()
  // console.log("orderdata from status edit",orderData);
  let placed,shipped,delivered,cancelled;
  if(orderData.status == 'placed') {placed=true}
  else if(orderData.status=='shipped') {shipped = true;}
  else if(orderData.status=='delivered') {delivered = true}
  else if(orderData.status=='cancelled') {cancelled = true}
  
  // console.log("status",stat);
  res.render('admin/editStatus',{layout:'admin-layout',orderData,placed,shipped,delivered,cancelled});
}

exports.editStatusButton=async(req,res)=>{
  let orderId = req.params.id
  // console.log("params id:",orderId)
  // console.log("req.body",req.body)
  await orderModel.findOneAndUpdate({_id:orderId},{$set:{status:req.body.status}})
  res.redirect('/admin/orders');
}


// module.exports = {
//     editCategoryButton: async (req,res)=>{
//         console.log("prrrr")
//         await categoryModel.findOneAndUpdate({"_id":req.params.id},{$set:{"category":req.body.category,"subCategory":req.body.subCategory}})
//         res.redirect('/admin/viewCategory');

//     },
//     deleteCategory: async (req,res)=>{
//         await categoryModel.deleteOne({ _id: req.params.id });
//         res.redirect('/admin/viewCategory');
//     }
// }