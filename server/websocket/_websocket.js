const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');
const Session = require("../models/Session");

wss.on('connection', function connection(ws, req){

    //store user's ws in room
    let token;
    try {
        token = ws.upgradeReq.headers.token;
    } catch (e) {
        token = null;
    }

    if (!token){
        try {
            token = req.headers['token'];
        }
        catch (e) {
            token = null;
        }
    }

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
                if (!uuid) return ws.send(JSON.stringify({status: 400, message: "no uuid specified"}));

                switch (message.type) {

                    case "joinSession":
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
                    case "leaveSession":
                        return SessionService.leaveSession(uuid, ws.userId);
                        break;
                    case "sendMessage":
                        return SessionService.sendMessage(ws.userId, uuid, message.message);
                        break
                }
            });
        })
        .catch((e) =>{
            if (e.message = "not opened") return;
            ws.send("no token");
            ws.close();
        })
    } else {
        ws.send("no token");
        ws.close();
    }
});
