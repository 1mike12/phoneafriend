const User = require("./../models/User");
const Skill = require("../models/Skill");
const Promise = require('bluebird');
const Session = require('../models/Session');
const faker = require("faker");

module.exports = dev = new function(){
    let self = this;

    self.users = function(){

        let admin = User.forge({
            email: "admin"
        });

        let mike = User.forge({
            email: "1mike12@gmail.com",
            first_name: "Mike",
            last_name: "Qin",
            profile_url: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAA3mAAAAJDMzN2UxOWE4LTAyMjAtNDI4Ni04MjM0LTI5ODJhY2EwZTQ0OA.jpg"
        });
        mike.setPassword("123");

        let brian = User.forge({
            email: "bgioia1@gmail.com",
            first_name: "Brian",
            last_name: "Gioia",
            profile_url: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAnyAAAAJGFmNWVlYzlhLTdjYzUtNDZjYS1iYTk2LTI2NzNkNTMwNjViMw.jpg"
        });
        brian.setPassword("123");

        return mike.save()
        .then(() => brian.save())
        .then(() => admin.save());
    };

    self.requesters = function(){
        let usersArray = [];
        for (let i = 0; i < 30; i++) {
            usersArray.push({
                email: faker.internet.email(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                profile_url: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 98) + 1}.jpg`
            })
        }
        let skillsIds;
        let users = User.forgeCollection(usersArray);
        return Promise.join(
            Skill.query(qb => qb.limit(3)).fetchAll(),
            users.invokeThen("save"),
            (s, users) =>{
                skillsIds = s.map(skill => skill.id);
                let sessions = Session.forgeCollection(users.map(user =>{
                    return Session.forge({
                        pupil_id: user.get("id"),
                        title: faker.lorem.sentence(),
                        description: faker.lorem.sentences(3)
                    })
                }));
                return sessions.invokeThen("save")
            }
        )
        .then(sessions =>{
            return Promise.all(sessions.map(session =>{
                return session.skills().attach(skillsIds)
            }))
        })
    };

    self.skills = () =>{
        let skillsArray = require("./data/skills");
        let skills = Skill.forgeCollection(skillsArray)
        return skills.invokeThen("save");
    };

    self.setSkills = () =>{
        return Promise.join(
            User.fetchAll(),
            Skill.query(qb => qb.limit(15)).fetchAll(),
            (users, skills) =>{
                return Promise.all(users.map(user =>{
                    user.skills().attach(skills.map(skill => skill.id))
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
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                })
                .save(),
                Session.forge({
                    uuid: "2",
                    pupil_id: mike.get('id'),
                    title: "How to belay in lead climbing with gri gri",
                    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti"
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
        .then(() => self.requesters())
    }
};
require("./_wiper").wipe()
.then(() => dev.run())
.then(() => process.exit());