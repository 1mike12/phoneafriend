
const SessionService = require("../../services/SessionService");
const Room = SessionService.Room;

describe("SessionService", function(){

    beforeEach(()=> SessionService.clear());

    it("Rooms add shit", () =>{
        let room = new Room([1, 2, 3]);

        expect(room.uuid).to.not.be.undefined;
        expect(room.getOtherUserIds(1)).to.deep.equal([2,3])
    });

    it("remove", () =>{
        let room = new Room([1, 2, 3]);
        room.removeUserById(1);
        expect(room.userIds).to.deep.equal([2,3])
    });

    it("create rooms", ()=>{
        let uuid = SessionService.createRoom([1,2]);

        let room = SessionService.getRoomForUserId(1);
        expect(room).to.not.be.undefined;
        expect(SessionService.getRoomForUserId(1)).to.equal(SessionService.getRoomForUserId(2))

        SessionService.addUserToRoom(uuid, 3);
        expect(room.userIds.length).to.equal(3);
    })
});

