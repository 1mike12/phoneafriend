const io = require('socket.io')(require("../router/server"));

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");
const SocketActions = require("../../shared/SocketActions");

io.use((socket, next) =>{
    try {
        let token = socket.handshake.headers.token;

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

    socket.on("joinRoom", (params, callback) =>{
        let uuid = params.uuid;
        if (!uuid) return callback(400);
        socket.join(params.uuid);
        callback(200)
    });

    socket.on("leaveRoom", (params, callback) =>{
        let uuid = params.uuid;
        if (!uuid) return callback(400);
        socket.leave(params.uuid);
        callback(200)
    });

    socket.on("exchangeDescription", (params, callback) =>{
        let {description, uuid} = params;
        if (!description || !uuid) return callback(400);

        socket.broadcast.to(uuid).emit(description);
        callback(200)
    });

    socket.on("exchangeCandidate", (params, callback) =>{
        let {candidate, uuid} = params;
        if (!candidate || !uuid) return callback(400);

        socket.broadcast.to(uuid).emit(candidate);
        callback(200)
    });


    // socket.join("room uuid");
    //
    // socket.leave("room uuid");

    //io.to("room uuid").emit("user connected");
})



