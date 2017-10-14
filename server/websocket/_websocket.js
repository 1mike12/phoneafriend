const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");
const SocketResponse = require("../../shared/SocketResponse");
wss.on('connection', function connection(ws, req){

    let token = getToken(ws, req);


    if (token){
        AuthenticationService.authenticate(token)
        .then(payload =>{
            ws.userId = payload.userId;
            ws.send('connected');
            /**
             * all messages should be {token, data, message, status}
             */
            ws.on('message', function incoming(message){
                message = JSON.parse(message);
                let uuid = message.uuid;


                const request = SocketResponse.fromRequest(message);
                switch (request) {

                    case SocketResponse.JOIN_SESSION:
                        if (!uuid) return ws.send(JSON.stringify({status: 400, message: "no uuid specified"}));
                        return Session.getByUUIDAsMember(uuid, ws.userId)
                        .then(session =>{
                            if (!session){
                                ws.send(JSON.stringify({
                                    status: 400,
                                    message: `no session with uuid: ${uuid}`
                                }))
                            } else {
                                SessionService.joinSession(uuid, ws.userId, ws);
                                ws.send(JSON.stringify({
                                    status: 200,
                                    message: `joined session ${uuid}`
                                }))
                            }
                        });
                        break;
                    case SocketResponse.LEAVE_SESSION:
                        if (!uuid) return ws.send(JSON.stringify({status: 400, message: "no uuid specified"}));
                        return SessionService.leaveSession(uuid, ws.userId);
                        break;
                    case SocketResponse.BROADCAST_TO_SESSION:
                        if (!uuid) return ws.send(JSON.stringify({status: 400, message: "no uuid specified"}));
                        return SessionService.sendMessage(ws.userId, uuid, message.message);
                        break
                }
            });
        })
        .catch((e) =>{
            if (e.message = "not opened") return;
            ws.send("no token");
            ws.close();
            throw e;
        })
    } else {
        ws.send("no token");
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
