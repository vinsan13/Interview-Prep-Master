const isAuth=(req,res,next)=>
{
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/login")
    }
};

const isNotAuth=(req,res,next)=>
{
    if (req.session.isLoggedIn) {
        res.redirect("/");
    } else {
        next();
    }
};

module.exports={isAuth,isNotAuth};