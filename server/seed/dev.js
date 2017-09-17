const User = require("./../models/User");
const Skill = require("../models/Skill");
const Promise = require('bluebird');
const Session = require('../models/Session');

module.exports = dev = new function(){
    let self = this;

    self.users = function(){
        let mike = User.forge({email: "1mike12@gmail.com"});
        mike.setPassword("123");

        let brian = User.forge({email: "bgioia@gmail.com"})
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
        return Promise.join(
            User.query(qb => qb.limit(2)).fetchAll(),
            Skill.query(qb => qb.limit(3)).fetchAll(),
            (users, skills) =>{
                let user1 = users.at(0);
                let user2 = users.at(1);

                return Session.forge({
                    teacher_id: user1.get("id"),
                    pupil_id: user2.get('id'),
                })
                .save()
                .then(session =>{
                    let skillIds = skills.map(skill => skill.get('id'));
                    return session.skills().attach(skillIds)
                })
            }
        )
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