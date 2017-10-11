const uuid = require("uuid/v1");
const Util = require("../../Util");

class Room {
    constructor(userIds = []){
        if (!Array.isArray(userIds)) throw new Error('needs to be array');
        this.userIds = userIds;
        this.uuid = uuid();
    }

    getOtherUserIds(userId){
        return this.userIds.filter(value => value !== userId)
    }

    removeUserById(userId){
        Util.removeFromArray(this.userIds, userId)
    }

    addUser(userId){
        if (this.userIds.includes(userId)) throw new Error("dupe userId");
        this.userIds.push(userId)
    }

}

class SessionService {

    constructor(){
        this.userId_Room = new Map();
        this.uuid_Room = new Map();
    }

    createRoom(userIds){
        let newRoom = new Room(userIds);
        this.uuid_Room.set(newRoom.uuid, newRoom);
        userIds.forEach(userId=> this.userId_Room.set(userId, newRoom));
        return newRoom.uuid;
    }

    getRoomForUserId(userId){
        return this.userId_Room.get(userId);
    }

    addUserToRoom(uuid, userId){
        let room = this.uuid_Room.get(uuid);
        room.addUser(userId)
    }

    clear(){
        this.userId_Room = new Map();
        this.uuid_Room = new Map();
    }

}

module.exports = new SessionService();
module.exports.Room = Room;