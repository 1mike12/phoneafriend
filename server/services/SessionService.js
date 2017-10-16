const Util = require("../../shared/Util");

class Room {
    constructor(uuid){
        this.uuid = uuid;
        this.userId_webSocket = new Map();
    }

    removeUserById(userId){
        this.userId_webSocket.delete(userId)
    }

    /**
     * add user without specifying web socket (null)
     * @param userId
     * @param webSocket optional will be set to null
     */
    addUser(userId, webSocket){
        this.userId_webSocket.set(userId, webSocket);
    }

    getUserIds(){
        return Array.from(this.userId_webSocket.keys());
    }

    getUserCount(){
        return this.getUserIds().length;
    }

    /**
     *
     * @param userId
     * @param {String} message to broadcast to all others in room
     */
    sendMessageFromUserId(userId, message){
        this.userId_webSocket.forEach((ws, id) =>{
            if (id !== userId && ws) ws.send(message);
        })
    }
}

class SessionService {

    constructor(){
        /**
         * uuid -< set
         * @type {Map}
         */
        this.uuid_UserIDs = new Map();
    }

    addUserToRoom(uuid, userId){
        let set = this.uuid_UserIDs.get(uuid);
        if (!set){
            set = new Set();
            this.uuid_UserIDs.set(uuid, set)
        }
        set.add(userId);
    }

    getOtherUserIdsForRoom(uuid, userId){
        if (typeof userId === "string") throw new Error("userId is string");
        let set = this.uuid_UserIDs.get(uuid);
        let array = [];
        for (let id of set.entries()) {
            if (id !== userId){
                array.push(id)
            }
        }
        return array
    }

    removeUserFromRoom(uuid, userId){
        let set = this.uuid_UserIDs.get(uuid);
        set.delete(userId);
        if (set.size === 0){
            this.uuid_UserIDs.delete(uuid)
        }
    }

    clear(){
        this.uuid_UserIDs.clear();
    }

}

module.exports = new SessionService();
module.exports.Room = Room;