const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const demoListings = require("./demoListings.js");
const { cloudinary } = require("../cloudConfig.js");

const OWNER_ID = process.env.DEMO_OWNER_ID || "6aaeaa4cb342b3678d845d62";
const CLOUDINARY_FOLDER = "wanderlust_DEV/demo-seed-v2";
const NEW_SEED_PREFIX = "wanderlust-demo-v2-";
const OLD_SEED_PREFIX = "wanderlust-demo-v1-";
const slugify = value => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function seedDemoListings() {
    if (!process.env.ATLASDB_URL) throw new Error("ATLASDB_URL is missing.");
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
        throw new Error("Cloudinary credentials are missing from the environment.");
    }

    await mongoose.connect(process.env.ATLASDB_URL);

    const ownerReference = await User.findById(OWNER_ID).select("username email");
    if (!ownerReference) throw new Error(`The configured existing owner ID ${OWNER_ID} was not found; no listings were changed.`);

    const ownerMatches = await User.find({
        $or: [
            { username: ownerReference.username },
            { email: ownerReference.email }
        ]
    }).select("_id username email");
    const owner = ownerMatches.find(user => user._id.equals(ownerReference._id));
    if (!owner) throw new Error("The existing owner could not be verified by username or email; no listings were changed.");

    const candidates = demoListings.map(listing => ({
        ...listing,
        seedKey: `${NEW_SEED_PREFIX}${slugify(listing.title)}`
    }));
    const seedKeys = candidates.map(listing => listing.seedKey);
    const existing = await Listing.find({ owner: owner._id, seedKey: { $in: seedKeys } })
        .select("seedKey")
        .lean();
    const existingKeys = new Set(existing.map(listing => listing.seedKey));
    const missingListings = candidates.filter(listing => !existingKeys.has(listing.seedKey));

    const titleCollisions = await Listing.findOne({
        owner: owner._id,
        title: { $in: missingListings.map(listing => listing.title) },
        seedKey: { $nin: seedKeys }
    }).select("title").lean();
    if (titleCollisions) {
        throw new Error(`A non-demo listing already uses the title “${titleCollisions.title}”; no prior demo listings were removed.`);
    }

    const operations = [];
    for (const listing of missingListings) {
        const images = [];
        for (const [index, sourceUrl] of listing.photoUrls.entries()) {
            const asset = await cloudinary.uploader.upload(sourceUrl, {
                folder: CLOUDINARY_FOLDER,
                public_id: `${slugify(listing.title)}-${String(index + 1).padStart(2, "0")}`,
                overwrite: true,
                unique_filename: false,
                resource_type: "image"
            });
            images.push({ url: asset.secure_url, filename: asset.public_id });
        }

        const seededListing = {
            title: listing.title,
            description: listing.description,
            image: images[0],
            images,
            price: listing.price,
            location: listing.location,
            country: listing.country,
            category: listing.category,
            geometry: { type: "Point", coordinates: listing.coordinates },
            owner: owner._id,
            seedKey: listing.seedKey
        };
        operations.push({
            updateOne: {
                filter: { seedKey: listing.seedKey },
                update: { $setOnInsert: seededListing },
                upsert: true
            }
        });
        console.log(`Uploaded ${images.length} new photos for: ${listing.title}`);
    }

    if (operations.length) await Listing.bulkWrite(operations, { ordered: true });

    const seededCount = await Listing.countDocuments({ owner: owner._id, seedKey: { $in: seedKeys } });
    if (seededCount !== candidates.length) {
        throw new Error(`Only ${seededCount} of ${candidates.length} replacement listings are present; old demo listings were preserved.`);
    }

    const oldListings = await Listing.find({
        owner: owner._id,
        seedKey: { $regex: `^${OLD_SEED_PREFIX}` }
    });
    const oldAssetIds = [...new Set(oldListings.flatMap(listing => {
        const images = listing.images?.length ? listing.images : (listing.image?.filename ? [listing.image] : []);
        return images.map(image => image.filename).filter(Boolean);
    }))];

    for (const oldListing of oldListings) {
        await Listing.findOneAndDelete({ _id: oldListing._id, owner: owner._id, seedKey: oldListing.seedKey });
    }
    const assetResults = await Promise.allSettled(oldAssetIds.map(publicId => cloudinary.uploader.destroy(publicId)));
    const failedAssetDeletes = assetResults.filter(result => result.status === "rejected").length;

    console.log(`Replacement complete for ${owner.username} (${owner._id}): ${operations.length} new listings, 3 photos each. Removed ${oldListings.length} prior demo listings${failedAssetDeletes ? `; ${failedAssetDeletes} old Cloudinary assets could not be removed` : " and their old Cloudinary photos"}. Other listings were preserved.`);
}

seedDemoListings()
    .catch(error => {
        console.error(`Demo seed failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    });

    