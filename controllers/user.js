const User = require("../models/user");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try
    {
    let {username,email,password} = req.body;
    const newUsr = new User({username,email});
    let registeredUsr = await User.register(newUsr , password);
    req.login(registeredUsr,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    });
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req,res)=>{
    req.flash("success","Welcome to WanderLust");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // If login was triggered by deleting a review,
    // redirect to the listing's show page instead.
    if (redirectUrl.includes("/reviews/") && redirectUrl.includes("_method=Delete")) {
        let id = redirectUrl.split("/")[2];
    
        redirectUrl = `/listings/${id}`;
    }

    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
};