

module.exports = {
    adminSessionChecker: (req,res,next)=>{
        if (req.session.loggedIn){
            next()
        }else{
            res.redirect('/admin/login')
        }
    },
    userSessionChecker: (req,res,next)=>{
        if (req.session.userLogin){
            next()
        }else{
            res.redirect('/login')
        }
    }
}
