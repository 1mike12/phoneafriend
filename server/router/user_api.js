let router = require("express").Router();
let Class = require("../models/Skill");
let User = require("../models/User");

router.get("/mine", (req, res, next) =>{
    User.where({id: req.userId}).fetch()
    .then(user =>{
        res.send(user)
    })
});

router.get("/:uuid", (req, res, next) =>{
    User.where({uuid: req.params.uuid}).fetch()
    .then(user =>{
        if (!user) res.status(500).send("not found");
        else res.send(user)
    });
});

module.exports = router;