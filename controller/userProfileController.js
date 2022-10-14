const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt');
const addressModel = require('../model/addressSchema');



module.exports={
    userProfile:async (req,res)=>{
        userId = req.session.userId
        console.log(userId,'hihihihjihihih');
        let userDetails= await userModel.findOne({_id:userId}).lean()
        console.log("userDetails",userDetails)
        let addressData = await addressModel.find({userId:userId}).lean()
        // console.log(addressData)
        res.render('user/userProfile',{userDetails,addressData,userPartials:true})
    },
    changeUsername:async(req,res)=>{
        // console.log(req.body.name)
        userId = req.session.userId
        await userModel.findOneAndUpdate({userId:userId},{$set:{'name':req.body.name}})
        res.json({})
    },
    changePassword:async(req,res)=>{
        // console.log(req.body.oldpass)
        // console.log(req.body.newpass)
        // console.log(req.body.confirmpass)
        // console.log(req.session)
        userId = req.session.userId
        let userData = await userModel.findOne({_id:userId})
        let correct = await bcrypt.compare(req.body.oldpass,userData.password)
        // console.log(correct)
        if(correct==true){
            console.log("old password correct")
            let newpassword = await bcrypt.hash(req.body.newpass,10)
            await userModel.findOneAndUpdate({_id:userId},{$set:{'password':newpassword}})
            // console.log("newpassword::",newpassword);
        }else console.log("incorrect")
        res.json({})
    },
    addAddress:(req,res)=>{
        res.render('user/addAddress')
    } ,
    submitAddress:async(req,res)=>{
        // console.log(req.body)
        userId = req.session.userId
        // console.log(req.session)
        req.body.userId = userId
        await addressModel.create(req.body);
        res.redirect('/userDetails')
    },
    deleteAddress:async(req,res)=>{
        let deleteId=req.body.addressId
        // console.log("delete address",deleteId)
        await addressModel.findOneAndDelete({_id:deleteId})
        res.json({})
    },
    editAddress:async(req,res)=>{
        console.log("this is body,:",req.body)
        userId=req.session.userId 
        let addressId = req.params.id
        console.log(addressId); 
        await addressModel.findOneAndUpdate({_id:addressId},{$set:{"firstName":req.body.firstName,"lastName":req.body.lastName,"email":req.body.email,"phoneNumber":req.body.phoneNumber,"address":req.body.address,"city":req.body.city,"state":req.body.state,"landmark":req.body.landmark}})
        res.redirect('/userDetails')
    }
  
}