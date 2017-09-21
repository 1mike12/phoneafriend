let router = require("express").Router();

router.get("/", function (req, res, next) {
    res.send("test homepages");
});

router.post("/", (req, res, next)=>{
    res.send(req.body)
});

module.exports = router;