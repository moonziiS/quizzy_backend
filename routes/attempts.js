const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("ATTEMPTS ROUTE LOADED!");
});

module.exports = router;
