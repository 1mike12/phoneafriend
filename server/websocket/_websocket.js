const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

const userId_WS = new Map();

wss.on('connection', function connection(ws, req){




    /**
     * all messages should be {token, data, message, status}
     */
    ws.on('message', function incoming(message){
        message = JSON.parse(message);
        console.log(`type: ${message.type}`);

        if (message.type === "connection"){

        }

    });


    ws.send('connected');
});


function unauthorized(ws){
    ws.send({status: 400, message: "Unauthorized, no token"})
}
