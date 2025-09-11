const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")


const validateListing = (req, res , next) => {
    let{error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el=> el.message)).join(",");
    
    throw new ExpressError(400,errMsg);
}else {
    next();
}};

// index routewhy 
router.get("/",wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    }));

// create route
 router.get("/new", (req, res) => {
    
    res.render("listings/new.ejs");
 });

 // show route
 router.get("/:id", wrapAsync(async (req, res, next) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing){
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listing});
 }));

 router.post("/", validateListing,wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);  //  use nested object
    await newListing.save();    
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
}));


 // edit route
 router.get("/:id/edit", wrapAsync(async(req , res) =>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs", {listing});
 }));
 
 //  update route
  router.put("/:id", wrapAsync(async (req, res) => {
     if (!req.body.listing){
         throw new ExpressError(400,"send valid data for listing");
     }
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
           req.flash("success", "listing Updated!");

      res.redirect(`/listings/${id}`);
  }));
 
 //  delete route
 router.delete("/:id", wrapAsync(async (req, res) => {
      let {id} = req.params;
      let deleted = await Listing.findByIdAndDelete(id);
     console.log(deleted);
     req.flash("success", "Successfully deleted a listing!");
     res.redirect("/listings");
 }));

 module.exports = router;