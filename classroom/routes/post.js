const express = require('express');
const router = express.Router();

// index route
router.get("/",(req, res) =>{
    res.send("get for post");
})

router.get("/:id",(req, res) =>{
    res.send("get for post id");
})

router.post("/",(req, res) =>{
    res.send("get for post ");
})

router.delete("/:id",(req, res) =>{
    res.send("get for delete route");
})

module.exports = router;