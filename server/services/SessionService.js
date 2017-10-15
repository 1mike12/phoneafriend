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
         * uuid -< room -< (Map) userId_WebSocket
         * @type {Map}
         */
        this.uuid_Room = new Map();
        /**
         *
         * @type {Map<integer, array<Room>>}
         */
        this.userId_Rooms = new Map();
    }

    getUserIds(){
        return Array.from(this.userId_Rooms.keys());
    }

    createRoomIfNotExist(uuid){
        if (!this.uuid_Room.get(uuid)){
            let room = new Room(uuid);
            this.uuid_Room.set(uuid, room)
        }
    }

    joinSession(uuid, userId, ws){
        this.createRoomIfNotExist(uuid);
        let room = this.uuid_Room.get(uuid);

        let usersRooms = this.userId_Rooms.get(userId);
        if (usersRooms){
            let usersRoomsUUID = usersRooms.map(room=> room.uuid);
            if (usersRoomsUUID.includes(uuid)) throw new Error(`user already part of room ${uuid}`);
            usersRooms.push(room);
        } else {
            this.userId_Rooms.set(userId, [room])
        }
        room.addUser(userId, ws);
    }

    getRoomsForUserId(userId){
        return this.userId_Rooms.get(userId);
    }

    getRoomByUUID(uuid){
        return this.uuid_Room.get(uuid)
    }

    /**
     * removes user from room, and removes room if nobody left in room
     * @param uuid
     * @param userId
     */
    leaveSession(uuid, userId){
        let room = this.uuid_Room.get(uuid);
        room.removeUserById(userId);
        if (room.getUserCount() === 0){
            this.uuid_Room.delete(uuid);
        }

        //remove room from user's Map
        let userRooms = this.userId_Rooms.get(userId);
        Util.removeFromArray(userRooms, room);

        //drop user if no longer part of any other rooms
        if (userRooms.length === 0){
            this.removeUser(userId)
        }
    }

    removeUser(userId){
        let rooms = this.userId_Rooms.get(userId);
        rooms.forEach(room => room.removeUserById(userId));
        this.userId_Rooms.delete(userId)
    }

    sendMessage(userId, uuid, message){
        let room = this.uuid_Room.get(uuid);
        room.sendMessageFromUserId(userId, message);
    }

    clear(){
        this.userId_Rooms = new Map();
        this.uuid_Room = new Map();
    }

}

module.exports = new SessionService();
module.exports.Room = Room;