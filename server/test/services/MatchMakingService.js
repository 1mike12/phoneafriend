const MatchMakingService = require("../../services/MatchMakingService");
const Session = require("../../models/Session");
const User = require('../../models/User')
const Skill = require('../../models/Skill')
const DeclinedSession = require("../../models/DeclinedSession");

let session;
let users;
let skill;

beforeEach(async () =>{
    skill = await Skill.forge({name: "spelunking"}).save()
    session = await Session.forge().save()
    await session.addSkills(skill);

    let usersJson = [];
    for (let i = 0; i < 15; i++) {
        usersJson.push({})
    }
    users = await User.forgeCollection(usersJson).invokeThen("save")
    await Promise.all(users.map(user => user.addSkills([skill])));
})

describe("MatchMakingService", () =>{

    it("should be able to mark away users", async () =>{
        let map = await MatchMakingService.getUserSkillCount(skill.get("id"), [], 4);
        expect(map.size).to.be.equal(4)
    })

    it("should return null when no more users found", async () =>{
        let declinedUserIds = users.map(user => user.get("id"));
        let map = await MatchMakingService.getUserSkillCount(skill.get("id"), declinedUserIds, 4);
        expect(map).to.be.null;
    })

    it("should getMatched and mark users as declined", async () =>{
        let users = await MatchMakingService.getMatchedUsersForSession(session, 4);
        expect(users.length).to.equal(4);

        let declined = await DeclinedSession.where({session_id: session.get("id")}).fetchAll();
        expect(declined.length).to.equal(4);

        users = await MatchMakingService.getMatchedUsersForSession(session, 4);
        expect(users.length).to.equal(4);

        declined = await DeclinedSession.where({session_id: session.get("id")}).fetchAll()
        expect(declined.length).to.equal(8);
    })

    it("should be able to loop multiple times", async () =>{
        let foundMatch = await MatchMakingService.findMatchForSession(session, 2)
        let declined = await DeclinedSession.where({session_id: session.get("id")}).fetchAll();
        expect(declined.length).to.equal(6);
        expect(foundMatch).to.be.false;
    })

    it("should fail to find match", async () =>{
        let foundMatch = await MatchMakingService.findMatchForSession(session, 1)
        expect(foundMatch).to.be.false;
    })

    it("should find match", async () =>{
        await session.set({teacher_id: 1}).save()
        let foundMatch = await MatchMakingService.findMatchForSession(session, 1)
        expect(foundMatch).to.be.true;
    })
})

afterEach(async () =>{
    await Promise.all(users.map(user => user.destroy({softDelete: false})));
    await Promise.all([
        session.destroy({softDelete: false}),
        skill.destroy({softDelete: false})
    ]);
});
