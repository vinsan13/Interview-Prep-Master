const {User} = require("../models/User")
const bcrypt = require("bcrypt")

exports.signup_get =(req,res) => {
    res.render('signup');
}

exports.login_get =(req,res) => {
    res.render('login');
}

exports.signup_post =async (req,res) => {
    try {
       
        const {username,email,password,confirmPassword }  = req.body;

        let hashedPassword = await bcrypt.hash(password, 12);
       

        const user = await User.create({ 
            email,
            password: hashedPassword,
            username
        })

        req.session.isLoggedIn = true;
        req.session.user = user;
        
        res.redirect("/");
        
    } catch (err) {
        console.log(err);
    }
}

exports.login_post = async (req,res) => {
    try {

        const {email,password} = req.body;
        let user = await User.findOne({email: email});
      

        if (user) {
            let hashedPassword = user.password

            const result = await bcrypt.compare(password, hashedPassword);

        if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
        } else {
            console.log("Invalid Password");
            res.redirect("/login")
        }
        } else {
            console.log("Invalid email");
            res.redirect("/login")
        }
    } catch (err) {
        console.log(err)
    }
}

exports.logout=(req,res)=>{
    req.session.isLoggedIn = false;
    req.session.user= null;
    res.redirect("/");
}

