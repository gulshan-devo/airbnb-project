const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")

const listings = require("./routes/listing.js");
app.use("/listings", listings);


main().then(() => {
    console.log('Connected to MongoDB');
}).catch
(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');}

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const validateReview = (req, res , next) => {
    let{error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el=> el.message)).join(",");
    
    throw new ExpressError(400,errMsg);
}else {
    next();
}};

 // new route
// app.get("/listings/new", (req, res) => {
//     res.render("Listings/new.ejs");
// });



// Review routes
app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));



// delete review route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
 // app.get("/testListing",async(req,res) => {
//     let samplelisting = new Listing({
//         title : "my new villa",
//         description:"By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India"
//     });
// await samplelisting.save();
// console.log("sample was saved");
// res.send("successful");
// });

app.all("/*splate",(req, res, next) => {
    next(new ExpressError(404,"page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "someting went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});

});

app.listen(8080,() => {
    console.log('Server is running on port 8080');
});



