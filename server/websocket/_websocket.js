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
        let roomUUID = params.roomUUID;
        if (!roomUUID) return callback("invalid roomUUID provided", null);
        roomUUID = roomUUID + "";

        socket.join(roomUUID);
        roomUUIDs.add(roomUUID);

        let othersInRoom = io.getSocketIdsForRoom(roomUUID, socket.id);
        socket.broadcast.to(roomUUID).emit(SocketActions.USER_JOINED_ROOM, othersInRoom);

        if (callback) callback(null, othersInRoom)
    });

    /**
     * remove self from room
     * alert others that someone left room
     */
    socket.on(SocketActions.LEAVE_ROOM, (params, callback) =>{
        let uuid = params.uuid;
        if (!uuid) return callback(400);

        let userId = socket.id;
        socket.leave(params.uuid);
        io.to(uuid).emit(SocketActions.USER_LEFT_ROOM, userId);
        if (callback) callback(200)
    });

    socket.on(SocketActions.VIDEO_OFFER, (params, callback) =>{
        let {description, roomUUID} = params;
        if (!description || !roomUUID) return callback(400);

        socket.broadcast.to(roomUUID)
        .emit(SocketActions.VIDEO_OFFER, {
            userUUID: socket.id,
            roomUUID,
            description
        });
        if (callback) callback(200)
    });

    socket.on(SocketActions.VIDEO_ANSWER, (params) =>{
        let {userUUID, roomUUID, description} = params;
        socket.broadcast.to(roomUUID)
        .emit(SocketActions.VIDEO_ANSWER, {
            userUUID: socket.id,
            roomUUID,
            description
        });
    });

    socket.on(SocketActions.NEW_ICE_CANDIDATE, (params) =>{
        let {candidate, roomUUID} = params;

        if (candidate){
            socket.broadcast.to(roomUUID)
            .emit(SocketActions.NEW_ICE_CANDIDATE, {userUUID: socket.id, candidate});
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

//todo disable direct messaging given socket.id A to socket.id B