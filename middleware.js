const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");


//Middleware for validation for listing Schema
module.exports.validateListing = (req,res,next)=>{

    let {error} = listingSchema.validate(req.body);

    if(error){
        // console.log(error);
        // throw new ExpressError(400,error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//Middleware for validation for review Schema
module.exports.validateReview = (req,res,next)=>{

    let {error} = reviewSchema.validate(req.body);

    if(error){
        // console.log(error);
        // throw new ExpressError(400,error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//middleware for checking whether the user iss logged in. i.e check isAuthenticated()
module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"...",req.originalUrl);
    // console.log(req.session);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Logged in First.");
        return res.redirect("/login");
    }
    else
    {
        next();
    }
};


//this middleware saves the req.originalUrl saved in the req.session.redirectUrl to the locals before the login happens , so that we can redirect to the previour requested url
//This is because req.login resets the session evry time it logins , so we need to save the url stored in the session 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,revId} = req.params;
    const review = await Review.findById(revId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
};