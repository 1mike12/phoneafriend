class Room {
    constructor(uuid){
        this.uuid = uuid;
        this.userId_webSocket = new Map();
    }

    removeUserById(userId){
        let ws = this.userId_webSocket.get(userId);
        ws.close();
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
            if(id !== userId && ws) ws.send(message);
        })
    }
}

class SessionService {

    constructor(){
        /**
         * uuid -< room -< (Map) userId_WebSocket
         * @type {Map}
         */
        this.uuid_Room = new Map();
    }

    getUserIds(){
        return Array.from(this.uuid_Room.keys());
    }

    createRoomIfNotExist(uuid){
        if(!this.uuid_Room.get(uuid)) {
            let room = new Room(uuid);
            this.uuid_Room.set(uuid, room)
        }
    }

    joinSession(uuid, userId, ws){
        this.createRoomIfNotExist(uuid);
        let room = this.uuid_Room.get(uuid);
        room.addUser(userId, ws);
    }

    getRoomByUUID(uuid){
        return this.uuid_Room.get(uuid)
    }

    leaveSession(uuid, userId){
        let room = this.uuid_Room.get(uuid);
        room.removeUserById(userId);
        if(room.getUserCount() === 0) {
            this.uuid_Room.delete(uuid);
        }
    }

    sendMessage(userId, uuid, message){
        let room = this.uuid_Room.get(uuid);
        room.sendMessageFromUserId(userId, message);
    }

    clear(){
        this.userId_Room = new Map();
        this.uuid_Room = new Map();
    }

}

module.exports = new SessionService();
module.exports.Room = Room;