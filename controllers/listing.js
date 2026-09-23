const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const photosFromFiles = (files = []) => files.map(file => ({
    url: file.secure_url,
    filename: file.public_id
}));

const photosForListing = listing => listing.images?.length
    ? listing.images
    : listing.image?.url ? [listing.image] : [];

module.exports.index = async (req, res) => {
    const { search, category } = req.query;

    let query = {};

    const listingsPerPage = 12;
    const currentPage = parseInt(req.query.page) || 1;

    // Search functionality
    if (search) {
        const searchWords = search.trim().split(/\s+/);

        query.$or = searchWords.flatMap(word => [
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

        // Get all matching listings
        const allListings = await Listing.find(query);

        // Sort according to search score
        allListings.sort((a, b) => {
            const getScore = (listing) => {
                let score = 0;

                const text =
                    `${listing.title} ${listing.location} ${listing.country}`
                    .toLowerCase();

                searchWords.forEach(word => {
                    if (text.includes(word.toLowerCase())) {
                        score++;
                    }
                });

                return score;
            };

            return getScore(b) - getScore(a);
        });

        // Pagination
        const totalListings = allListings.length;
        const totalPages = Math.ceil(totalListings / listingsPerPage);

        const startIndex = (currentPage - 1) * listingsPerPage;
        const endIndex = startIndex + listingsPerPage;

        const paginatedListings = allListings.slice(startIndex, endIndex);

        return res.render("listings/index.ejs", {
            allListings: paginatedListings,
            currentPage,
            totalPages,
            search,
            category
        });
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Total number of matching listings
    const totalListings = await Listing.countDocuments(query);

    const totalPages = Math.ceil(totalListings / listingsPerPage);

    // Find only listings needed for this page
    const allListings = await Listing.find(query)
        .skip((currentPage - 1) * listingsPerPage)
        .limit(listingsPerPage);

    res.render("listings/index.ejs", {
        allListings,
        currentPage,
        totalPages,
        search,
        category
    });
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
    const photos = photosFromFiles(req.files);
    if (!photos.length) {
        req.flash("error", "Please upload at least one listing photo.");
        return res.redirect("/listings/new");
    }

    //mapbox forward geocoding code
    let mapboxRes = await geocodingClient.forwardGeocode({
    query: req.body.listing.location ,
    limit: 1//Give me at most 1 matching result.
    })
    .send();//sending request to mapbox and waiting for response

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = photos;
    newListing.image = photos[0];
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
    const {id} = req.params;
    const listing = await Listing.findById(id);
    const submittedListing = req.body.listing;
    const removeValues = submittedListing.removeImages === undefined
        ? []
        : Array.isArray(submittedListing.removeImages)
            ? submittedListing.removeImages
            : [submittedListing.removeImages];
    const currentPhotos = photosForListing(listing);
    const removedPhotos = currentPhotos.filter(photo => removeValues.includes(photo.filename));
    const keptPhotos = currentPhotos.filter(photo => !removeValues.includes(photo.filename));
    const newPhotos = photosFromFiles(req.files);
    const photos = [...keptPhotos, ...newPhotos];

    if (!photos.length) {
        req.flash("error", "A listing must have at least one photo. Upload a photo or keep one of the current photos.");
        return res.redirect(`/listings/${id}/edit`);
    }

    const mapboxRes = await geocodingClient.forwardGeocode({
        query: submittedListing.location,
        limit: 1
    }).send();

    listing.title = submittedListing.title;
    listing.description = submittedListing.description;
    listing.location = submittedListing.location;
    listing.country = submittedListing.country;
    listing.price = submittedListing.price;
    listing.category = submittedListing.category;
    listing.geometry = mapboxRes.body.features[0].geometry;
    listing.images = photos;
    listing.image = photos[0];
    await listing.save();

    await Promise.all(removedPhotos.filter(photo => photo.filename).map(photo =>
        cloudinary.uploader.destroy(photo.filename)
    ));
    req.flash("success"," Listing Edited.");
    res.redirect(`/listings/${listing._id}`)
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const photoIds = [...new Set(photosForListing(listing).map(photo => photo.filename).filter(Boolean))];
    await Promise.all(photoIds.map(filename => cloudinary.uploader.destroy(filename)));
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted.");
    res.redirect("/listings");
};
