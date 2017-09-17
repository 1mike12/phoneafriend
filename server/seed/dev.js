const User = require("./../models/User");
const Skill = require("../models/Skill");
const Promise = require('bluebird');
const Session = require('../models/Session');

module.exports = dev = new function(){
    let self = this;

    self.users = function(){
        let mike = User.forge({email: "1mike12@gmail.com"});
        mike.setPassword("123");

        let brian = User.forge({email: "bgioia@gmail.com"});
        brian.setPassword("123");

        return Promise.all([
            mike.save(),
            brian.save()
        ]);
    };

    self.skills = () =>{
        let skillsArray = require("./skills");
        let skills = Skill.forgeCollection(skillsArray)
        return skills.invokeThen("save");
    };

    self.setSkills = () =>{
        return Promise.join(
            User.fetchAll(),
            Skill.query(qb => qb.limit(10)).fetchAll(),
            (users, skills) =>{
                return Promise.all(users.map(user =>{
                    user.skills().attach(skills.slice(0, 3))
                }))
            }
        )

    };

    self.createSessions = () =>{
        return User.query(qb => qb.limit(2)).fetchAll()
        .then(users =>{
            let user1 = users.at(0);
            let user2 = users.at(1);
            return Promise.all([
                Session.forge({
                    teacher_id: user1.get("id"),
                    pupil_id: user2.get('id'),
                })
                .save(),
                Session.forge({
                    pupil_id: user2.get('id'),
                })
                .save(),
                Skill.query(qb => qb.limit(3)).fetchAll()
            ])
        })
        .then(array =>{
            let session1 = array[0];
            let session2 = array[1];
            let skills = array[2];
            let skillIds = skills.map(skill => skill.get('id'));

            return Promise.all([
                session1.skills().attach(skillIds),
                session2.skills().attach(skillIds)
            ])
        })
    };

    self.run = function(){
        return self.users()
        .then(() => self.skills())
        .then(() => self.setSkills())
        .then(() => self.createSessions())
    }
};
require("./_wiper").wipe()
.then(() => dev.run())