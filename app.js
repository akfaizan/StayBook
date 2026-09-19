require('dotenv').config();
// console.log(`Hello ${process.env}`)

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingRoute = require("./routes/listing");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.json());
app.engine("ejs",ejsMate);

const dbUrl = process.env.ATLASDB_URL;

const store =  MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret : process.env.MONGO_SESSION_SECRET,//Encrypts/protects session data , Protects stored session contents
    },
    touchAfter: 24*3600,
});

const sessionOptions = {
    store:store,
    secret : process.env.SESSION_SECRET,//Signs session ID cookie , Protects against cookie tampering
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }    
}; 
async function main(){
    await mongoose.connect(dbUrl);
}

main()
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch((err)=>{
        console.log(err);
    });



//express-session middleware to create new session
app.use(session(sessionOptions));

app.use(flash());//flash middleware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware for storing in locals 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//users route
app.use("/",userRoute);

//listings route
app.use("/listings",listingRoute);

//reviews route
app.use("/listings/:id/reviews",reviewRoute);

// 404 page handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handler middleware
app.use((err,req,res,next)=>{
    //image upload multer size-limit error
     if (err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "Image size must be less than 5 MB.");
        return res.redirect("/listings/new");
    }//edit check
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("listings/error.ejs",{message});
   
});

app.listen("8080",()=>{
    console.log("server is listening at port 8080");
});