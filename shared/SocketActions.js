class SocketAction {
    constructor(type, successMessage){
        this.type = type;
        this.successMessage = successMessage;
    }

    equals(other){
        if (!(other instanceof SocketAction)) throw new Error("not instance");
        return this.type === other.type
    }

    request(params = {}){
        return JSON.stringify(Object.assign(params, {type: this.type}))
    }

    success(params = {}){
        return JSON.stringify(Object.assign(params, {type: this.type, successMessage: this.successMessage}))
    }

    error(params = {}){
        return JSON.stringify(Object.assign(params, {type: this.type, status: 400}))
    }
}

class SocketActions {

    static buildMap(){
        if (SocketActions.type_Response === null){

            //make sure no dupe keys or actionNames
            let keySet = new Set();
            let actionTypeSet = new Set();

            let validEntries = Object.entries(SocketActions)
            .filter(entryArray =>{
                let key = entryArray[0];
                let value = entryArray[1];

                if (value instanceof SocketAction){
                    if (keySet.has(key)) throw new Error("dupe");
                    if (actionTypeSet.has(value.type)) throw new Error('dupe');

                    keySet.add(key);
                    actionTypeSet.add(value.type);
                    return true;
                }
                return false;
            });
            let keyEntryArray = validEntries.map(entry => [entry[1].type, entry[1]]);
            SocketActions.type_Response = new Map(keyEntryArray);
        }
    }

    static fromRequest(requestJson){
        this.buildMap();
        if (typeof requestJson === "string"){
            requestJson = JSON.parse(requestJson);
        }

        return SocketActions.type_Response.get(requestJson.type)
    }
}

SocketActions.type_Response = null;

SocketActions.JOIN_SESSION = new SocketAction("joinSession", "joinSessionSuccess");
SocketActions.LEAVE_SESSION = new SocketAction("leaveSession", "leaveSessionSuccess");
SocketActions.BROADCAST_TO_SESSION = new SocketAction("broadcastToSession", "broadcastToSessionSuccess");


module.exports = SocketActions;