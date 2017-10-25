let router = require("express").Router();
let Class = require("../models/Session");
let User = require("../models/User");
const Session = require('../models/Session');
const knex = require("../DB").knex;
const SessionService = require("../services/SessionService");

router.delete("/", (req, res, next) =>{
    Class.where({uuid: req.body.uuid, pupil_id: req.userId}).fetch()
    .then(item =>{
        return item.destroy()
    })
    .then(() => res.sendStatus(200))
    .catch(e =>{
        res.sendStatus(400);
        throw e;
    })
});

router.get("/", (req, res, next) =>{
    Class.fetchAll({withRelated: ["teacher", "pupil", "skills"]})
    .then(collection => res.send(collection))
});

router.get("/mine", (req, res, next) =>{
    Class.where({pupil_id: req.userId}).fetchAll()
    .then(collection =>{
        res.send(collection)
    })
});

router.get("/teachable", (req, res, next) =>{

    let declinedSessionIds;
    knex('declined_sessions').where({
        user_id: req.userId,
    })
    .select('session_id')
    .then(result =>{
        declinedSessionIds = result.map(row => row.session_id);
        return User.where({id: req.userId}).fetch({withRelated: "skills"})
    })
    .then(user =>{
        let skillIds = user.related("skills").map(s => s.get("id"));

        //todo optimize this many to many call
        return Class.query(qb =>{
            qb.whereNull("teacher_id");
            qb.whereNot("pupil_id", user.get('id'));
            qb.distinct("sessions.*");
            qb.innerJoin("sessions_skills", "sessions.id", "sessions_skills.session_id");
            qb.innerJoin("skills", "skills.id", "sessions_skills.skill_id");
            qb.whereIn("skills.id", skillIds)
            qb.whereNotIn("sessions.id", declinedSessionIds);
            qb.orderBy("sessions.created_at")
        })
        .fetchAll({
            withRelated: ["skills", "pupil"]
        })
    })
    .then(collection => res.send(collection))
});

router.get("/teachable/count", (req, res, next) =>{
    User.where({id: req.userId}).fetch({withRelated: "skills"})
    .then(user =>{
        let skillIds = user.related("skills").map(s => s.get("id"));

        return Class.query(qb =>{
            qb.count("*").from(
                function(){
                    this.distinct("sessions.id")
                    .from("sessions")
                    .innerJoin("sessions_skills", "sessions.id", "sessions_skills.session_id")
                    .innerJoin("skills", "skills.id", "sessions_skills.skill_id")

                    .whereIn("skills.id", skillIds)
                    .whereNull("teacher_id")
                    .whereNot('pupil_id', user.get("id"))
                    .as("X")
                }
            )
        })
        .fetch()
    })
    .then(knexObj => res.send(knexObj.get("count")))
});

router.post("/decline", (req, res, next) =>{
    const {uuid} = req.body;
    return Session.where({uuid}).fetch()
    .then(session =>{
        return knex('declined_sessions').insert({user_id: req.userId, session_id: session.get("id")})
    })
    .then(() => res.sendStatus(200))
    .catch(next)
});

router.post("/accept", (req, res, next) =>{
    const {uuid} = req.body;
    if (!uuid) throw new Error("no uuid");

    return Session.query(qb =>{
        qb.where({uuid})
        .andWhere("pupil_id", "!=", req.userId)
    }).fetch()
    .then(session =>{
        if (!session) return res.setStatus(400).send("no session found");

        return session.set({teacher_id: req.userId}).save()
        .then(() => res.sendStatus(200))

    })
    .catch(next)
});

router.get("/in-progress/", (req, res, next) =>{

    return Session.query(qb =>{
        qb.where("pupil_id", "!=", req.userId)
        .andWhere("teacher_id", req.userId)
        .andWhere("completed", false)
    })
    .fetchAll()
    .then(sessions =>{
        res.send(sessions)

    })
    .catch(next)
});

router.get("/completed", (req, res, next) =>{

    return Session.query(qb =>{
        qb.where("pupil_id", "!=", req.userId)
        .andWhere("teacher_id", req.userId)
        .andWhere("completed", true)
    })
    .fetchAll()
    .then(sessions =>{
        res.send(sessions)

    })
    .catch(next)
});

router.get('/teachable-single', (req, res, next) =>{
    let {after} = req.query;
    if (!after) after = 0;

    User.where({id: req.userId}).fetch({withRelated: "skills"})
    .then(user =>{
        let skillIds = user.related("skills").map(s => s.get("id"));

        //todo optimize this many to many call
        return Class.query(qb =>{
            qb.distinct("sessions.*");
            qb.whereNull("teacher_id");
            qb.whereNot("pupil_id", user.get('id'));

            qb.innerJoin("sessions_skills", "sessions.id", "sessions_skills.session_id");
            qb.innerJoin("skills", "skills.id", "sessions_skills.skill_id");
            qb.whereIn("skills.id", skillIds);
            qb.orderBy("sessions.created_at")
        })
        .fetchPage({
            limit: 1,
            offset: after,
            withRelated: ["skills", "pupil"]
        })
    })
    .then(result =>{
        let session = (result.models && result.models[0]) ? result.models[0] : null;
        let response = {
            session: session,
            rowCount: result.pagination.rowCount,
            offset: result.pagination.offset,
            limit: result.pagination.limit
        };
        res.send(response)
    })
});

router.post("/", (req, res, next) =>{
    let instance = Class.forge(req.body);
    let skillsArray = req.body.skills;

    let promise;
    if (instance.get("id")){
        promise = Class.where({id: instance.get("id"), pupil_id: req.userId})
        .fetch()
        .then(session =>{
            if (session){
                return instance.save();
            } else {
                throw new Error("couldn't save session")
            }
        })

    } else {
        instance.set('pupil_id', req.userId);
        promise = instance.save()
    }

    promise.then(session => session.load("skills"))
    .then(session =>{
        let insertingSkillIds = skillsArray.map(skill => skill.id);
        let existingSkillIds = session.related("skills").map(skill => skill.get("id"));

        let toRemove = existingSkillIds.filter(skillId => !insertingSkillIds.includes(skillId));
        let toInsert = insertingSkillIds.filter(skillId => !existingSkillIds.includes(skillId));

        return Promise.all([
            session.skills().detach(toRemove),
            session.skills().attach(toInsert)
        ])
    })
    .then(() => res.sendStatus(200))
    .catch(e => res.send(e));
});

router.get("/info", (req, res, next) =>{
    let io = require("../websocket/_websocket");
    let info = io.getInfo();
    res.send(info);
});

router.get("/test/:uuid/:userId", (req, res, next) =>{
    return Session.getByUUIDAsMember(req.params.uuid, req.params.userId)
    .then(session =>{
        res.send(session)
    })
});

router.get("/get/:uuid", (req, res, next) =>{
    Class.where({uuid: req.params.uuid, pupil_id: req.userId}).fetch({withRelated: ["skills", "pupil", "teacher"]})
    .then(item => res.send(item))
});

module.exports = router;