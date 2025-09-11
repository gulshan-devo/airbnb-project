const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");


const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

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

const sessionOption = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
    if (res.locals.success.length > 0) {
        console.log(res.locals.success);
    }
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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