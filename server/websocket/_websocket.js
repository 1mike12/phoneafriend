const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

const SessionService = require("../services/SessionService");
const AuthenticationService = require('../services/AuthenticationService');

wss.on('connection', function connection(ws, req){

    //store user's ws in room
    let token = req.headers['token'];
    if (token){
        AuthenticationService.authenticate(token)
        .then(() =>{
            ws.send('connected');
            /**
             * all messages should be {token, data, message, status}
             */
            ws.on('message', function incoming(message){
                message = JSON.parse(message);

                switch(message.type){
                    case "joinRoom":
                        let roomUUID = message.uuid;

                        break;
                    case "leaveRoom":
                        break;
                }

            });
        })
        .catch((e) =>{
            if (e.message = "not opened") return;
            ws.send("no token");
            ws.close();
        })
    }
    ws.send("no token");
    ws.close();
});
