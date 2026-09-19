const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const {search , category} = req.query;

    let query = {};

    // Search functionality
    if (search) {
        const searchWords = search.trim().split(/\s+/);
        query.$or = searchWords.flatMap(word =>[
            {
                title: {
                    $regex: word,
                    $options: "i"
                }
            },
            {
                location: {
                    $regex: word,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: word,
                    $options: "i"
                }
            }
        ]);

        const allListings = await Listing.find(query);

        allListings.sort((a, b) => {
            const getScore = (listing) => {
                let score = 0;

                const text = `${listing.title} ${listing.location} ${listing.country}`.toLowerCase();

                searchWords.forEach(word => {
                    if (text.includes(word.toLowerCase())) {
                        score++;
                    }
                });

                return score;
            };

            return getScore(b) - getScore(a);
        });

        return res.render("listings/index.ejs",{allListings})

    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Find listings according to the query
    const allListings = await Listing.find(query);
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings})
};

module.exports.newForm = async(req,res)=>{
    console.log(req.user);//req.user stores data of user that is currently logged in 
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","No such listing is available.");
        return res.redirect("/listings");
    }
    
    console.log(listing);
    res.render("listings/show.ejs",{listing});
    
};

module.exports.createListing = async(req,res)=>{
    //mapbox forward geocoding code
    let mapboxRes = await geocodingClient.forwardGeocode({
    query: req.body.listing.location ,
    limit: 1//Give me at most 1 matching result.
    })
    .send();//sending request to mapbox and waiting for response

    let url = req.file.secure_url;
    let filename = req.file.public_id;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = mapboxRes.body.features[0].geometry; //saving { type: 'Point', coordinates: [ longitude, latitude ] }
    // console.log(newListing);
    let savedListing = await newListing.save();
    console.log("savedListing:",savedListing);
    req.flash("success","New Listing Created.");
    res.redirect("/listings");
};

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","No such listing is available.");
        res.redirect("/listings");
    }
    else{
        res.render("listings/edit.ejs",{listing});
    }
};

module.exports.updateListing = async(req,res)=>{
    //mapbox forward geocoding code
    let mapboxRes = await geocodingClient.forwardGeocode({
    query: req.body.listing.location ,
    limit: 1//Give me at most 1 matching result.
    })
    .send();//sending request to mapbox and waiting for response

    let {id} = req.params;
    let newListing = req.body.listing;
    newListing.geometry = mapboxRes.body.features[0].geometry; //saving { type: 'Point', coordinates: [ longitude, latitude ] }
    let listing = await Listing.findByIdAndUpdate(id,{...newListing},);

    if(typeof req.file !== "undefined"){
        await cloudinary.uploader.destroy(listing.image.filename);
        let url = req.file.secure_url;
        let filename = req.file.public_id;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success"," Listing Edited.");
    res.redirect(`/listings/${listing._id}`)
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    await cloudinary.uploader.destroy(listing.image.filename);
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted.");
    res.redirect("/listings");
};