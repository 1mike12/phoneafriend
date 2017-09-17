/**
 * Created by 1mike12 on 6/18/2017.
 */
const InterestCache = require("../../services/InterestCache");
const User = require("../../models/User");
const Interest = require("../../models/Skill");

let tim = User.forge({user_id: "1", user_name: "timmy123"});
tim.relations.interests = Interest.forgeCollection([
    {id: 1}, {id: 2}, {id: 3}
]);

const jim = User.forge({user_id: "2", user_name: "jimmy123"});
jim.relations.interests = Interest.forgeCollection([
    {id: 1}, {id: 2}
]);

const bobby = User.forge({user_id: "3", user_name: "bobby"});
bobby.relations.interests = Interest.forgeCollection([
    {id: 9}, {id: 10}
]);

describe("InterestCache", function() {

    it("find shared interest ids", done => {
        let ids = InterestCache.findSharedInterestIds(tim, jim);
        expect(ids).to.deep.equal([1, 2]);
        done()
    });

    it ("find matches", done=> {
        let matchedUsers = InterestCache.findMatches(tim, [jim, bobby]);
        expect(matchedUsers.length).to.eql(1);
        expect(matchedUsers[0].get("user_name")).to.eql("jimmy123");
        done()
    })

});

