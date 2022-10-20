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

exports.adminIndexRoute = async function (req, res, next) {
  try {
    let delivered = await orderModel.find({ status: 'delivered' }, { status: 1, _id: 0 }).lean()
    let deliveredCount = delivered.length
    let shipped = await orderModel.find({ status: 'shipped' }, { status: 1, _id: 0 }).lean()
    let shippedCount = shipped.length
    let cancelled = await orderModel.find({ status: 'cancelled' }, { status: 1, _id: 0 }).lean()
    let cancelledCount = cancelled.length
    let placed = await orderModel.find({ status: 'placed' }, { status: 1, _id: 0 }).lean()
    let placedCount = placed.length

    let orderData = await orderModel.find().populate('products.productId').lean()
    const deliveredOrder = orderData.filter(e => e.status == 'delivered')
    const TotalRevenue = deliveredOrder.reduce((accr, crr) => accr + crr.grandTotal, 0)
    const eachDaySale = await orderModel.aggregate([{ $match: { status: "delivered" } }, { $group: { _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, total: { $sum: "$grandTotal" } } }]).sort({ _id: -1 })
    let today = new Date()
    res.render("admin/index", {
      admin: req.session.admin,
      layout: "admin-layout", deliveredCount, shippedCount, cancelledCount, placedCount, TotalRevenue, eachDaySale
    });
  } catch (error) {
    next(error);
  }

};

//signup page
exports.adminSignup = function (req, res, next) {
  try {
    if (req.session.loggedIn) {
      res.redirect("/admin");
    } else {
      res.render("admin/signup", adminlayout);
    }
  } catch (error) {
    next(error)
  }

};

exports.adminSignupAction = async function (req, res, next) {
  try {
    let oldUser = await adminModel.findOne({ email: req.body.email });
    if (oldUser) {
      return res.send("old user found");
    }
    let newUser = await adminModel.create(req.body);
    req.session.loggedIn = true;
    res.redirect("/admin");
  } catch (error) {
    next(error)
  }
};

//login page
exports.adminLogin = function (req, res, next) {
  try {
    if (req.session.loggedIn) {
      res.redirect("/admin");
    } else {
      res.render("admin/login", adminlayout);
    }
  } catch (error) {
    next(error)
  }
};

exports.adminLoginAction = async function (req, res, next) {
  try {
    let adminData = await adminModel.findOne({ email: req.body.email });
    if (adminData) {
      let correct = await bcrypt.compare(req.body.password, adminData.password);
      if (correct == true) {
        req.session.loggedIn = true;
        req.session.admin = adminData;
        return res.redirect("/admin");
      } else {
        res.send("password incorrect");
      }
    } else {
      res.send("no user found");
    }
  } catch (error) {
    next(error)
  }

};

/// USER DETAILS ///
exports.userDetails = async function (req, res, next) {
  try {
    let userData = await userModel.find().lean();
    res.render("admin/userTable", { userData, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }

};
exports.editBlock = async function (req, res, next) {
  try {
    let userId = req.params.id;
    let block = await userModel.find({ _id: userId }).lean();
    res.render("admin/Blockform", { block, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }
};
exports.userBlock = async function (req, res, next) {
  try {
    let userId = req.params.id;
    await userModel.updateOne({ _id: userId }, { block: true });
    res.redirect("/admin/userTable");
  } catch (error) {
    next(error)
  }
};
exports.userActive = async function (req, res, next) {
  try {
    let userId = req.params.id;
    await userModel.updateOne({ _id: userId }, { block: false });
    res.redirect("/admin/userTable");
  } catch (error) {
    next(error)
  }
};
//adminLogout
exports.adminLogout = function (req, res, next) {
  try {
    req.session.loggedIn = false;
    res.redirect("/admin/login");
  } catch (error) {
    next(error)
  }
};

///CATEGORY DETAILS ///
exports.viewCategory = async function (req, res, next) {
  try {
    let categoryData = await categoryModel.find().lean();
    res.render("admin/viewCategory", { categoryData, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }
};
exports.addCategory = function (req, res, next) {
  try {
    res.render("admin/addCategory", adminlayout);
  } catch (error) {
    next(error)
  }
};
exports.createCategory = async function (req, res, next) {
  try {
    let categoryExists = await categoryModel
      .findOne({ category: req.body.category })
      .lean();
    if (categoryExists) {
      res.send("category exists");
    } else {
      categoryModel.create(req.body);
      return res.redirect("/admin/viewCategory");
    }
  } catch (error) {
    next(error)
  }
};
///EDIT CATEGORY///
exports.editCategory = function (req, res, next) {
  try {
    let categoryId = req.params.id;
    res.render("admin/editCategory", { categoryId, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }
};
exports.editCategoryButton = async function (req, res, next) {
  try {
    await categoryModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { category: req.body.category } }
    ); //,"subCategory":req.body.subCategory
    res.redirect("/admin/viewCategory");
  } catch (error) {
    next(error)
  }
};

exports.deleteCategory = async function (req, res, next) {
  try {
    await categoryModel.deleteOne({ _id: req.params.id });
    res.redirect("/admin/viewCategory");
  } catch (error) {
    next(error)
  }
};

exports.productDetails = async (req, res, next) => {
  try {
    let productData = await productModel.find().populate('category').lean();
    res.render("admin/viewProducts", { productData, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }
};
exports.addProduct = async function (req, res, next) {
  try {
    const categoryData = await categoryModel.find().lean();
    res.render("admin/addProduct", { categoryData, layout: "admin-layout" });
  } catch (error) {
    next(error)
  }
};
exports.createProduct = async (req, res, next) => {
  try {
    let productNames = await productModel.findOne({ name: req.body.name }).lean();
    if (productNames) return res.send("product already exists");
    const arrImages = req.files.map((value) => value.filename);
    req.body.imagepath = arrImages;
    await productModel.create(req.body);
    res.redirect("/admin/viewProducts");
  } catch (error) {
    next(error)
  }
};
exports.viewEditProduct = async (req, res, next) => {
  try {
    editId = req.params.id;
    let productData = await productModel.findOne({ _id: editId }).lean();
    let categoryData = await categoryModel.find().lean();
    res.render("admin/editProduct", {
      productData,
      categoryData,
      layout: "admin-layout",
    });
  } catch (error) {
    next(error)
  }

};
exports.editProduct = async (req, res, next) => {
  try {
    let arrImages = req.files.map((value) => value.filename);
    if (arrImages[0]) {
      imagepat = await productModel
        .findOne({ "_id:": req.params.id }, { imagepath: 1, _id: 0 })
        .lean();
      req.body.imagepath = arrImages;
      await productModel.findOneAndUpdate(
        { "_id": req.params.id },
        {
          $set: { "name": req.body.name, "brandName": req.body.brandName, 'description': req.body.description, 'category': req.body.category, 'stock': req.body.stock, 'amount': req.body.amount, 'discount': req.body.discount, 'imagepath': req.body.imagepath },
        }
      );
    } else {
      await productModel.findOneAndUpdate(
        { "_id": req.params.id },
        {
          $set: { "name": req.body.name, "brandName": req.body.brandName, 'description': req.body.description, 'category': req.body.category, 'stock': req.body.stock, 'amount': req.body.amount, 'discount': req.body.discount }
        }
      );
    }
    res.redirect('/admin/viewProducts');
  } catch (error) {

  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    await productModel.findOneAndDelete({ "_id": req.params.id }, { $set: { "name": req.body.name, "brandName": req.body.brandName, "description": req.body.description, "category": req.body.category, "stock": req.body.stock, "amount": req.body.amount, "discount": req.body.discount, "imagepath": req.body.imagepath } })
    res.redirect('/admin/viewProducts')
  } catch (error) {
    next(error)
  }
}
exports.orders = async (req, res, next) => {
  try {
    let orderData = await orderModel.find().sort({ createdAt: -1 }).populate('userId').lean()

    res.render('admin/orders', { layout: false, orderData })
  } catch (error) {
    next(error)
  }
}
exports.editStatus = async (req, res, next) => {
  try {
    let orderId = req.params.id
    let orderData = await orderModel.findOne({ _id: orderId }).lean()
    let placed, shipped, delivered, cancelled;
    if (orderData.status == 'placed') { placed = true }
    else if (orderData.status == 'shipped') { shipped = true; }
    else if (orderData.status == 'delivered') { delivered = true }
    else if (orderData.status == 'cancelled') { cancelled = true }
    res.render('admin/editStatus', { layout: 'admin-layout', orderData, placed, shipped, delivered, cancelled });
  } catch (error) {
    next(error)
  }
}

exports.editStatusButton = async (req, res, next) => {
  try {
    let orderId = req.params.id
    await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: req.body.status } })
    res.redirect('/admin/orders');
  } catch (error) {
    next(error)
  }
}

