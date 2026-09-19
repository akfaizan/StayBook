const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({//You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);//First you need to plugin Passport-Local Mongoose into your User schema

module.exports = mongoose.model('User',userSchema);