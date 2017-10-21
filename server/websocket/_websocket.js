const io = require('socket.io')(require("../router/server"));

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");
const SocketActions = require("../../shared/SocketActions");

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
        let uuid = params.uuid;
        let userId = socket.userId;
        if (!uuid) return callback(400);

        socket.join(params.uuid);
        SessionService.addUserToRoom(uuid, userId);
        let othersInRoom = SessionService.getOtherUserIdsForRoom(uuid, userId);
        callback(othersInRoom)
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
        callback(200)
    });

    socket.on(SocketActions.SEND_DESCRIPTION, (params, callback) =>{
        let {description, uuid} = params;
        if (!description || !uuid) return callback(400);

        socket.broadcast.to(uuid)
        .emit(SocketActions.RECEIVE_DESCRIPTION, {userId: socket.userId, description});
        callback(200)
    });

    socket.on(SocketActions.SEND_CANDIDATE, (params, callback) =>{
        let {candidate, uuid} = params;
        if (!candidate || !uuid) return callback(400);

        socket.broadcast.to(uuid)
        .emit(SocketActions.RECEIVE_CANDIDATE, {userId: socket.userId, candidate});
        callback(200)
    });


    // socket.join("room uuid");
    //
    // socket.leave("room uuid");

    //io.to("room uuid").emit("user connected");
});

module.exports = io;