const io = require('socket.io')(require("../router/server"));
//
// const optionsForIo = {
//     pingInterval: 5000,
//     pingTimeout: 10000
// }

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");
const SocketActions = require("../../shared/SocketActions");

/**
 * to keep track of real rooms vs socket io's automatic rooms created for each user
 * @type {Set}
 */
const roomUUIDs = new Set();

io.use((socket, next) =>{
    try {
        let token = socket.handshake.query.token;

        if (!token) return next(new Error("authentication error"));

        AuthenticationService.authenticate(token)
        .then(payload =>{
            socket.userId = payload.userId;
            next()
        })
        .catch(e =>{
            return next(new Error("authentication error"))
        })
    }
    catch (e) {
        return next(new Error("authentication error"))
    }
});

io.on("connect", socket =>{

    socket.on(SocketActions.JOIN_ROOM, (params, callback) =>{
        let uuid = params.uuid + "";
        let userId = socket.userId;
        if (!uuid) return callback(400);

        socket.join(uuid);
        roomUUIDs.add(uuid);
        SessionService.addUserToRoom(uuid, userId);


        let othersInRoom = io.getSocketIdsForRoom(uuid, socket.id);
        socket.broadcast.to(uuid).emit(SocketActions.USER_JOINED_ROOM, othersInRoom);

        if (callback) callback(othersInRoom)
    });

    /**
     * remove self from room
     * alert others that someone left room
     */
    socket.on(SocketActions.LEAVE_ROOM, (params, callback) =>{
        let uuid = params.uuid;
        if (!uuid) return callback(400);

        let userId = socket.userId;
        socket.leave(params.uuid);
        io.to(uuid).emit(SocketActions.USER_LEFT_ROOM, userId);
        SessionService.removeUserFromRoom(uuid, socket.userId);
        if (callback) callback(200)
    });

    socket.on(SocketActions.VIDEO_OFFER, (params, callback) =>{
        let {description, uuid} = params;
        if (!description || !uuid) return callback(400);

        socket.broadcast.to(uuid)
        .emit(SocketActions.VIDEO_OFFER, {
            userId: socket.userId,
            uuid,
            description
        });
        if (callback) callback(200)
    });

    socket.on(SocketActions.VIDEO_ANSWER, (params) =>{
        let {uuid, description} = params;
        socket.broadcast.to(uuid)
        .emit(SocketActions.VIDEO_ANSWER, {
            userId: socket.userId,
            uuid,
            description
        });
    });

    socket.on(SocketActions.NEW_ICE_CANDIDATE, (params) =>{
        let {candidate, uuid} = params;

        if (candidate){
            socket.broadcast.to(uuid)
            .emit(SocketActions.NEW_ICE_CANDIDATE, {userId: socket.userId, uuid, candidate});
        }
    })


    // socket.join("room uuid");
    //
    // socket.leave("room uuid");

    //io.to("room uuid").emit("user connected");
});

io.getRooms = function(){
    return io.sockets.adapter.rooms;
};

io.getInfo = function(){
    let rooms = io.sockets.adapter.rooms;
    let newObject = Object.keys(rooms)
    .filter(roomUUID => roomUUIDs.has(roomUUID))
    .reduce((total, roomUUID) =>{
        let socketIds = rooms[roomUUID].sockets;
        let userIds = [];
        for (let socketId in socketIds) {
            let socket = io.getSocketForSocketid(socketId);
            if (socket) userIds.push(socket.userId)
        }
        total[roomUUID] = userIds;
        return total;
    }, {});
    return newObject;
};

io.getSocketForSocketid = function(socketId){
    return io.sockets.connected[socketId];
};

/**
 * @param roomUUID
 * @return {Array}
 */
io.getSocketIdsForRoom = function(roomUUID, exceptSocketId){
    let socketsObject = io.sockets.adapter.rooms[roomUUID].sockets;
    let ids = [];
    for (let socketId in socketsObject) {
        if (socketId !== exceptSocketId){
            ids.push(socketId)
        }
    }
    return ids;
};

module.exports = io;