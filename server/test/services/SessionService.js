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

        room.addUserAndWebSocket(1, socket1);
        room.addUserAndWebSocket(2, socket2);
        room.addUserWithoutWebSocket(3);

        expect(room.getUserIds()).to.deep.equal([1, 2, 3]);

        room.sendMessageFromUserId(1, '{"key" : "value"}');
        expect(socket2.sent).to.be.true;
        expect(socket1.sent).to.be.false;
    });

    it("remove user from room", () =>{
        let room = new Room();
        let socket1 = new TestWebSocket();
        let socket2 = new TestWebSocket();

        room.addUserAndWebSocket(1, socket1);
        room.addUserAndWebSocket(2, socket2);

        room.removeUserById(1)
        expect(room.getUserIds()).to.deep.equal([2])
        expect(socket1.closed).to.be.true;
        expect(socket2.closed).to.be.false;
    });

    it("create rooms", () =>{
        let uuid = SessionService.createRoom([1, 2]);
        let socket1 = new TestWebSocket();
        let socket2 = new TestWebSocket();

        SessionService.addWebSocketForUserId(1, socket1);
        SessionService.addWebSocketForUserId(2, socket2);

        let room = SessionService.getRoomForUserId(1);
        expect(room).to.not.be.undefined;
        expect(SessionService.getRoomForUserId(1)).to.equal(SessionService.getRoomForUserId(2))

        SessionService.addUserToRoom(uuid, 3);
        expect(room.getUserIds().length).to.equal(3);
    });


    it("messaging to rooms", () =>{
        SessionService.createRoom([1, 2]);
        let socket1 = new TestWebSocket();
        let socket2 = new TestWebSocket();
        SessionService.addWebSocketForUserId(1, socket1);
        SessionService.addWebSocketForUserId(2, socket2);

        SessionService.sendMessageFromUserId(1, '{"key" : "value"}');
        expect(socket2.sent).to.be.true;
        expect(socket1.sent).to.be.false;

    });

    it("should remove user", () =>{
        SessionService.createRoom([1, 2]);
        let socket1 = new TestWebSocket();
        let socket2 = new TestWebSocket();
        SessionService.addWebSocketForUserId(1, socket1);
        SessionService.addWebSocketForUserId(2, socket2);

        expect(SessionService.getUserIds().includes(1));

        SessionService.removeUserId(1);

        expect(socket1.closed).to.be.true;
        expect(socket2.closed).to.be.false;
        expect(!SessionService.getUserIds().includes(1))
    });
});

