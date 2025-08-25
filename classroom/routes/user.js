const express = require('express');
const router = express.Router();

// index route
router.get("/",(req, res) =>{
    res.send("get for user");
})

router.get("/:id",(req, res) =>{
    res.send("get for user id");
})

router.post("/",(req, res) =>{
    res.send("post for user ");
})

router.delete("/:id",(req, res) =>{
    res.send("get for delete route");
})

module.exports = router;