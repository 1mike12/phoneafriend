const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");
const SocketActions = require("../../shared/SocketActions");

wss.on('connection', function connection(ws, req){

    let token = getToken(ws, req);


    if (token){
        AuthenticationService.authenticate(token)
        .then(payload =>{
            ws.userId = payload.userId;
            ws.send(SocketActions.CONNECT.success());
            /**
             * all messages should be {token, data, message, status}
             */
            ws.on('message', function incoming(message){
                message = JSON.parse(message);
                let uuid = message.uuid;


                const request = SocketActions.fromRequest(message);
                switch (request) {

                    case SocketActions.JOIN_SESSION:
                        if (!uuid) return ws.send(JSON.stringify({status: 400, message: "no uuid specified"}));
                        return Session.getByUUIDAsMember(uuid, ws.userId)
                        .then(session =>{
                            if (!session){
                                ws.send(SocketActions.JOIN_SESSION.error({message: `no valid session with uuid ${uuid}`}))
                            } else {
                                SessionService.joinSession(uuid, ws.userId, ws);
                                ws.send(SocketActions.JOIN_SESSION.success())
                            }
                        })
                        .catch(e =>{
                            ws.send(SocketActions.JOIN_SESSION.error());
                            throw e;
                        });
                        break;
                    case SocketActions.LEAVE_SESSION:

                        if (!uuid) return ws.send(SocketActions.LEAVE_SESSION.error({message: "no uuid specified"}));
                        try {
                            SessionService.leaveSession(uuid, ws.userId);
                            ws.send(SocketActions.LEAVE_SESSION.success())
                        } catch (e) {
                            ws.send(SocketActions.LEAVE_SESSION.error({message: "unknown error"}));
                            throw e;
                        }
                        break;
                    case SocketActions.BROADCAST_TO_SESSION:

                        if (!uuid) return ws.send(SocketActions.BROADCAST_TO_SESSION.error({message: "no uuid specified"}));
                        SessionService.sendMessage(ws.userId, uuid, message.message);
                        break
                }
            });
        })
        .catch((e) =>{
            if (e.message = "not opened") return;
            ws.send(SocketActions.CONNECT.error({message: "no token"}));
            ws.close();
            throw e;
        })
    } else {
        ws.send(SocketActions.CONNECT.error({message: "no token"}));
        ws.close();
    }
});

function getToken(ws, req){
    //store user's ws in room
    try {
        let token = ws.upgradeReq.headers.token;
        if (token) return token;
    } catch (e) {
    }

    try {
        let token = req.headers['token'];
        if (token) return token;
    } catch (e) {

    }

    try {
        let token = ws.protocol;
        if (token) return token;
    } catch (e) {

    }

    try {
        //ws://username:password@host.com
        //interpreted server side as "Basic Base64(username:password)"
        //Basic dXNlcm5hbWU6ZXlKaGJHY2lPaUpJVXpJ...
        let basicString = req.headers.authorization;
        let token64 = basicString.split(" ")[1];
        let token = new Buffer(token64, 'base64').toString("ascii");
        if (token) return token;
    } catch (e) {

    }
    return null;
}
