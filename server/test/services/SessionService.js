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
        expect(socket1.closed).to.be.true;
        expect(socket2.closed).to.be.false;
    });

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
        expect(room.getUserIds().length).to.equal(3);
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

    it("should remove user", () =>{
        const roomUUID = "abc";
        let socket1 = new TestWebSocket();
        let socket2 = new TestWebSocket();

        SessionService.joinSession(roomUUID, 1, socket1);
        SessionService.joinSession(roomUUID, 2, socket2);

        expect(SessionService.getUserIds().includes(1));

        SessionService.leaveSession(roomUUID, 1);

        expect(socket1.closed).to.be.true;
        expect(socket2.closed).to.be.false;
        expect(SessionService.getUserIds().includes(1)).to.be.false;
    });
});

