let router = require("express").Router();
let Class = require("../models/Skill");
let User = require("../models/User");

router.get("/", (req, res, next) =>{
    Class.fetchAll()
    .then(collection => res.send(collection))
});

router.get("/mine", (req, res, next) =>{
    User.where({id: req.userId}).fetch({withRelated: "skills"})
    .then(user =>{
        res.send(user.related("skills"))
    })
});

/**
 * query = "string"
 * exclude = csv of (of already seleceted) skills to exclude "mountain biking, writing"
 */
router.get("/search", (req, res, next) =>{

    const {query, exclude} = req.query;
    if (!query) return res.setStatus(400).send('empty query');
    let excludedTerms;
    if (exclude) excludedTerms = exclude.split(",").map(term => term.toLowerCase());

    Class.query(qb =>{
        qb.where("name", "LIKE", `${query}%`);
        if (excludedTerms) qb.whereNotIn("name", excludedTerms);
        qb.limit(10);
    })
    .fetchAll()
    .then(collection => res.send(collection))
});

router.post("/", (req, res, next) =>{
    let body = req.body;
    res.send(200)
});

router.delete("/", (req, res, next) =>{
    let skillId = req.body.id;
    User.where({id: req.userId}).fetch()
    .then(user =>{
        return user.skills().detach([skillId])
    })
    .then(() => res.status(200))
    .catch(e =>{
        res.setStatus(400).send(e)
    })
});

module.exports = router;