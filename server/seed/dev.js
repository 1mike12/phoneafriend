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

        return mike.save()
        .then(() => brian.save())
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
                    console.log("this part")
                    user.skills().attach(skills.slice(0, 3))
                }))
            }
        )

    };

    self.createSessions = () =>{
        return Promise.all([
            User.query(qb =>{
                qb.limit(2);
                qb.whereNot("email", "1mike12@gmail.com")
            }).fetchAll(),
            User.where({email: "1mike12@gmail.com"}).fetch()
        ])
        .then(res =>{
            let otherUsers = res[0];
            let mike = res[1];

            let user1 = otherUsers.at(0);
            return Promise.all([
                Session.forge({
                    uuid: "1",
                    teacher_id: user1.get("id"),
                    pupil_id: mike.get('id'),
                    title: "Need help with toyota corolla bearing replacement",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill"
                })
                .save(),
                Session.forge({
                    uuid: "2",
                    pupil_id: mike.get('id'),
                    title: "How to belay in lead climbing with gri gri",
                    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum e"
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
.then(()=> process.exit())