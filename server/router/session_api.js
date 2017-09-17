let router = require("express").Router();
let Class = require("../models/Session");
let User = require("../models/User");

router.get("/", (req, res, next) =>{
    Class.fetchAll({withRelated: ["teacher", "pupil"]})
    .then(collection => res.send(collection))
});

router.get("/mine", (req, res, next) =>{
    Class.where({pupil_id: req.userId}).fetchAll()
    .then(collection => res.send(collection))
});

router.get("/teachable", (req, res, next) =>{
    User.where({id: req.userId}).fetch({withRelated: "skills"})
    .then(user =>{
        let skillIds = user.related("skills").map(s=> s.get("id"));

        //todo optimize this many to many call
        return Class.query(qb =>{
            qb.whereNull("teacher_id");
            qb.whereNot("pupil_id", user.get('id'));
            qb.distinct("sessions.id");
            qb.innerJoin("sessions_skills", "sessions.id", "sessions_skills.session_id");
            qb.innerJoin("skills", "skills.id", "sessions_skills.skill_id");
            qb.whereIn("skills.id", skillIds);
        })
        .fetchAll({
            withRelated: ["skills"]
        })
    })
    .then(collection => res.send(collection))
});


module.exports = router;