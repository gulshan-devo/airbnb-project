const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

const  sessionOptions =  {
    secret: 'your_secret_key' , 
    resave : false, 
    saveUninitialized : true,
    };

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/register', (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name==="anonymous"){
        req.flash("error", "You are logged in as anonymous");
    }else{
        req.flash("success", "You are logged in as " + name);
    }
    res.redirect('/hello');
});


app.get('/hello', (req, res) => {
    res.render("page.ejs", {name :req.session.name });
});

// app.get('/reqcount', (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`count set to ${req.session.count}`);
// });





app.listen(3000, () => {
    console.log("Server is running on port 3000");
})