class SocketResponse {
    constructor(type, successMessage){
        this.type = type;
        this.successType = successMessage;
    }

    equals(other){
        if (!(other instanceof SocketResponse)) throw new Error("not instance");
        return this.type === other.type
    }

    createErrorResponse(message){
        return {type: this.type, message: message, status: 400}
    }

    toJSON(){
        return {type: this.type, successType: this.successType, status: 200}
    }
}

class SocketResponses {

    static fromRequest(requestJson){
        if (SocketResponses.type_Response === null){

            let validEntries = Object.entries(SocketResponses)
            .filter(entryArray =>{
                return entryArray[1] instanceof SocketResponse
            });

            let keyEntryArray = validEntries.map(entry=> [entry[1].type, entry[1]]);


            SocketResponses.type_Response = new Map(keyEntryArray);
        }

        return SocketResponses.type_Response.get(requestJson.type)
    }
}

SocketResponses.JOIN_SESSION = new SocketResponse("joinSession", "joinSessionSuccess");
SocketResponses.LEAVE_SESSION = new SocketResponse("leaveSession", "leaveSessionSuccess");
SocketResponses.BROADCAST_TO_SESSION = new SocketResponse("broadcastToSession", "broadcastToSessionSuccess");

SocketResponses.type_Response = null;

module.exports = SocketResponses;