const SessionService = require("../../services/SessionService");
const Room = SessionService.Room;

class TestWebSocket {
    constructor(){
        this.sent = false;
        this.closed = false;
    }

    send(message){
        this.sent = true;
    }

    close(){
        this.closed = true;
    }
}

describe("SessionService", function(){

    beforeEach(() => SessionService.clear());

    describe("Room", () =>{
        it("Rooms add shit", () =>{
            let room = new Room();
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();

            room.addUser(1, socket1);
            room.addUser(2, socket2);

            expect(room.getUserIds()).to.deep.equal([1, 2]);

            room.sendMessageFromUserId(1, '{"key" : "value"}');
            expect(socket2.sent).to.be.true;
            expect(socket1.sent).to.be.false;
        });

        it("remove user from room", () =>{
            let room = new Room();
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();

            room.addUser(1, socket1);
            room.addUser(2, socket2);

            room.removeUserById(1)
            expect(room.getUserIds()).to.deep.equal([2])
        });
    })

    describe("SessionService", () =>{
        it("create rooms", () =>{
            const roomUUID = "abc";
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();
            let socket3 = new TestWebSocket();

            SessionService.joinSession(roomUUID, 1, socket1);
            SessionService.joinSession(roomUUID, 2, socket2);

            let room = SessionService.getRoomByUUID(roomUUID);
            expect(room).to.not.be.undefined;

            SessionService.joinSession(roomUUID, 3, socket3);
            expect(room.getUserSkillCount().length).to.equal(3);
        });

        it("should be able to get all user's rooms", ()=>{
            let socket1 = new TestWebSocket();
            const roomID1 = "111";
            const roomID2 = "222";

            const userId1 = 1;

            SessionService.joinSession(roomID1, userId1, socket1);
            SessionService.joinSession(roomID2, userId1, socket1);

            let rooms = SessionService.getRoomsForUserId(userId1);

            let uuids = rooms.map(room=> room.uuid);
            expect(uuids.includes(roomID1)).to.be.true;
            expect(uuids.includes(roomID2)).to.be.true;

        });

        it("should remove user's rooms when user disconnects", ()=>{
            let socket1 = new TestWebSocket();
            const roomID1 = "111";
            const roomID2 = "222";

            const userId1 = 1;

            SessionService.joinSession(roomID1, userId1, socket1);
            SessionService.joinSession(roomID2, userId1, socket1);

            SessionService.removeUser(userId1);

            let rooms = SessionService.getRoomsForUserId(userId1);
            expect(rooms).to.be.undefined;
        });

        it("can delete room when last person leaves", () =>{
            const roomUUID = "abc";
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();

            SessionService.joinSession(roomUUID, 1, socket1);
            SessionService.joinSession(roomUUID, 2, socket2);

            let room = SessionService.getRoomByUUID(roomUUID);
            expect(room).to.not.be.undefined;

            SessionService.leaveSession(roomUUID, 1);
            SessionService.leaveSession(roomUUID, 2);

            room = SessionService.getRoomByUUID(roomUUID);

            expect(room).to.be.undefined;
        });


        it("messaging to rooms", () =>{
            const roomUUID = "abc";
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();

            SessionService.joinSession(roomUUID, 1, socket1);
            SessionService.joinSession(roomUUID, 2, socket2);

            SessionService.sendMessage(1, roomUUID, '{"key" : "value"}');
            expect(socket2.sent).to.be.true;
            expect(socket1.sent).to.be.false;

        });

        it("should remove user if not part of any other sessions", () =>{
            const roomUUID = "abc";
            let socket1 = new TestWebSocket();
            let socket2 = new TestWebSocket();

            SessionService.joinSession(roomUUID, 1, socket1);
            SessionService.joinSession(roomUUID, 2, socket2);

            expect(SessionService.getUserIds().includes(1));

            SessionService.leaveSession(roomUUID, 1);
            let userIds = SessionService.getUserIds();
            expect(userIds.includes(1)).to.be.false;
        });
    })


});

