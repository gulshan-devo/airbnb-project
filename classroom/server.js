const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');

app.get("/", (req, res) =>{
    res.send("Welcome to the home page");
})

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})