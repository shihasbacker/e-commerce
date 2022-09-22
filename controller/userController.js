const userModel = require("../model/userSchema");
const bcrypt = require('bcrypt')



exports.indexRoute = function(req,res,next){
    res.render('user/index');
}

//signup page
exports.getSignup = function(req,res,next){
    if(req.session.userLogin) res.redirect('/')
    else res.render('user/signup');
}

exports.SignupAction= async function(req,res){
    let oldUser = await userModel.findOne({email:req.body.email})
    if(oldUser){
        console.log("old user")
        return res.send('old user found')
    }
    let newUser = await userModel.create(req.body)
    console.log(newUser)
    req.session.userLogin = true;
    res.redirect("/")
}

//login page
exports.getLogin = function(req,res,next){
    if(req.session.userLogin){
        res.redirect('/')
    }else res.render('user/user-login');
}

exports.LoginAction=async function(req,res){
    let userData = await userModel.findOne({email:req.body.email})
    if(userData) {
        if(userData.block==true) res.send("you are blocked by admin")

        else{
        let correct =await bcrypt.compare(req.body.password, userData.password);
        // console.log(correct)
        if(correct==true){
            req.session.userLogin = true;
            return res.redirect('/')
        } 
        else res.send("password incorrect")
        }
    }
    else{
        res.send('no user found')
    }
}
exports.getLogout=function(req,res){
    req.session.userLogin=false;
    res.redirect('/login')
}




// exports.userDatatoDBRoute= function(req,res){
//     userDetailsInsert(req.body);
//     console.log("data entered to db");
// }