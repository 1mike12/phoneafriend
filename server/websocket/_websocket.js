const WebSocket = require("ws");
const wss = new WebSocket.Server({server: require("../router/server")});

wss.on('connection', function connection(ws, req) {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});


function unauthorized(ws){
    ws.send({message: "Unauthorized, no token"})
}
