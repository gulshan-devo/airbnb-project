const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// cookies creation
app.get("/getcookies", (req, res) =>{
    res.cookie('great', 'yes it is');
   res.cookie('namme', 'John Doe');
    res.send("cookie has been set");
});

// cookie parser
app.get('/greet', (req, res) => {
    let {name ='anonymous'} = req.cookies;
    res.send(`Hey there, ${name}`);
});


app.get("/", (req, res) =>{
    console.dir(req,cookies);
    res.send("Welcome to the home page");
})

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})