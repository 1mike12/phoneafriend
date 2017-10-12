const uuid = require("uuid/v1");

class Room {
    constructor(){
        this.uuid = uuid();
        this.userId_webSocket = new Map();
    }

    removeUserById(userId){
        let ws = this.userId_webSocket.get(userId);
        ws.close();
        this.userId_webSocket.delete(userId)
    }

    addUserWithoutWebSocket(userId){
        this.addUserAndWebSocket(userId);
    }

    /**
     * add user without specifying web socket (null)
     * @param userId
     * @param webSocket optional will be set to null
     */
    addUserAndWebSocket(userId, webSocket = null){
        this.userId_webSocket.set(userId, webSocket);
    }

    getUserIds(){
        return Array.from(this.userId_webSocket.keys());
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
         * uuid -< room -< (Map) userId_WebSocket
         * @type {Map}
         */
        this.userId_Room = new Map();
        this.uuid_Room = new Map();
    }

    getUserIds(){
        return Array.from(this.userId_Room.keys());
    }

    createRoom(userIds){
        let newRoom = new Room();
        userIds.forEach(userId => newRoom.addUserWithoutWebSocket(userId));

        this.uuid_Room.set(newRoom.uuid, newRoom);
        userIds.forEach(userId => this.userId_Room.set(userId, newRoom));
        return newRoom.uuid;
    }

    getRoomForUserId(userId){
        return this.userId_Room.get(userId);
    }

    addUserToRoom(uuid, userId){
        let room = this.uuid_Room.get(uuid);
        room.addUserAndWebSocket(userId);
        this.userId_Room.set(userId, room);
    }

    addWebSocketForUserId(userId, ws){
        let room = this.userId_Room.get(userId);
        room.addUserAndWebSocket(userId, ws);
    }

    removeUserId(userId){
        let room = this.userId_Room.get(userId);
        room.removeUserById(userId);
        this.userId_Room.delete(userId);
    }

    sendMessageFromUserId(userId, message){
        let room = this.userId_Room.get(userId);
        room.sendMessageFromUserId(userId, message);
    }

    clear(){
        this.userId_Room = new Map();
        this.uuid_Room = new Map();
    }

}

module.exports = new SessionService();
module.exports.Room = Room;