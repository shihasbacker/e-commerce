const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt');
const addressModel = require('../model/addressSchema');



module.exports = {
    userProfile: async (req, res, next) => {
        try {
            userId = req.session.userId
            let userDetails = await userModel.findOne({ _id: userId }).lean()
            let addressData = await addressModel.find({ userId: userId }).lean()
            res.render('user/userProfile', { userDetails, addressData, userPartials: true })
        } catch (error) {
            next(error)
        }
    },
    changeUsername: async (req, res, next) => {
        try {
            userId = req.session.userId
            await userModel.findOneAndUpdate({ _id: userId }, { $set: { 'name': req.body.name } })
            res.json({})
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            userId = req.session.userId
            let userData = await userModel.findOne({ _id: userId })
            let correct = await bcrypt.compare(req.body.oldpass, userData.password)
            if (correct == true) {
                let newpassword = await bcrypt.hash(req.body.newpass, 10)
                await userModel.findOneAndUpdate({ _id: userId }, { $set: { 'password': newpassword } })
            } else
                res.json({})
        } catch (error) {
            next(error)
        }
    },
    addAddress: (req, res, next) => {
        try {
            res.render('user/addAddress')
        } catch (error) {
            next(error)
        }
    },
    submitAddress: async (req, res, next) => {
        try {
            userId = req.session.userId
            req.body.userId = userId
            await addressModel.create(req.body);
            res.redirect('/userDetails')
        } catch (error) {
            next(error)
        }
    },
    deleteAddress: async (req, res, next) => {
        try {
            let deleteId = req.body.addressId
            await addressModel.findOneAndDelete({ _id: deleteId })
            res.json({})
        } catch (error) {
            next(error)
        }
    },
    editAddress: async (req, res, next) => {
        try {
            userId = req.session.userId
            let addressId = req.params.id
            await addressModel.findOneAndUpdate({ _id: addressId }, { $set: { "firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email, "phoneNumber": req.body.phoneNumber, "address": req.body.address, "city": req.body.city, "state": req.body.state, "landmark": req.body.landmark } })
            res.redirect('/userDetails')
        } catch (error) {
            next(error)
        }
    }

}