const User=require("../models/user");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/Signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser=await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WonderLust");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/Signup")
    }
}

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=async(req, res) => {
    req.flash("success","Welcome back to WonderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Successfully logout");
        res.redirect("/listings");
    })
}