const User = require("./../models/User");
const Skill = require("../models/Skill");
const Promise = require('bluebird')
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

    self.run = function(){
        return self.users()
        .then(() => self.skills())
        .then(() => self.setSkills())
    }
};
require("./_wiper").wipe()
.then(() => dev.run())