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


