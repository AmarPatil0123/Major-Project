const Listing = require("../models/listing");
const ExpressError = require("../util/ExpressError");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filenane = req.file.filenane;
    let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    })
    newListing.image = { url, filenane };
    newListing.owner = req.user._id

    await newListing.save();
    req.flash("success", "New listing is created");
    res.redirect("/listings");

}

module.exports.findListing=async(req,res)=>{
    let country=req.body.place;
    const listings=await Listing.find({country:country});
    if(listings && listings.length){
        res.render("./listings/search-dest.ejs",{listings});
    }else{
    req.flash("error","Listing not found");
    res.redirect("/listings");
    }
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listings });
}


    
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    let originalImage=data.image.url;
    originalImage=originalImage.replace("/upload","/upload/h_250,w_250");
    res.render("./listings/edit.ejs", { data,originalImage });
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Data not found");
    } else {
        let { id } = req.params;
        let result = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        
        if(typeof req.file !=="undefined"){
            let path=req.file.path;
            let filename=req.file.filename;

            result.image.url=path;
            result.image.filename=filename;

            await result.save();
        }
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    }
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}