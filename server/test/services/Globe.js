/**
 * Created by 1mike12 on 6/18/2017.
 */
const Globe = require("../../services/Globe");
const User = require("../../models/User");

const tim = User.forge({user_id: "1", user_name: "timmy123"});
const jim = User.forge({user_id: "2", user_name: "jimmy123"});

describe("BaseModel", function() {

    beforeEach(done => {
        Globe.removeAllUsers();
        done();
    });

    it("add", done => {
        Globe.insert(0, 0, 1);
        expect(Globe.getAllUsers().length).to.eql(1);
        done()
    });

    it("remove", done => {
        Globe.insert(0, 0, 1);
        Globe.removeUser(1);
        let allUsers = Globe.getAllUsers();
        expect(allUsers.length).to.eql(0);
        done()
    });

    it("remove all", done => {
        Globe.insert(0, 0, 1);
        Globe.insert(0, 0, 2);
        let allUsers = Globe.getAllUsers();
        expect(allUsers.length).to.eql(2);

        Globe.removeAllUsers();
        expect(Globe.getAllUsers().length).to.eql(0);
        done();
    });

    it("search", done => {
        Globe.insert(0, 0, 1);
        Globe.insert(20, 20, 2);
        let results = Globe.search(-1, 1, -1, 1);
        expect(results.length).to.eql(1);
        done();
    })

});

