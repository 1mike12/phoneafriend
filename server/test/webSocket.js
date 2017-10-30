const WebSocket = require("ws");
const config = require("../config");

const port = process.env.NODE_ENV === "test" ? config.testPort : config.port;

const Session = require("../models/Session");
const User = require("../models/User");
const test = require("../seed/test");
const Promise = require('bluebird');
const SocketActions = require("../../shared/SocketActions");
const io = require("socket.io-client");

let token1;
let token2;

let userId1;
let userId2;

before(() =>{
    return test.run()
    .then(() => Promise.join(
        User.where({email: "1mike12@gmail.com"}).fetch(),
        User.where({email: "bgioia1@gmail.com"}).fetch(),
        (user1, user2) =>{
            token1 = user1.getTokenForPassword("123");
            userId1 = user1.get("id");
            token2 = user2.getTokenForPassword("123");
            userId2 = user2.get("id");
        }
    ))
});

describe("socket io middleware authentication", () =>{


    it("Authentication with protocol", (done) =>{
        let socket = io("http://localhost:9009", {
            query: `token=${token1}`
        });
        socket.on('connect', function(data){
            console.log(data);
            socket.disconnect();
            done();
        });

        socket.on("error", () =>{
            socket.disconnect()
            throw new Error("there was an error before connecting")
        })
    });

    it("Authentication should fail without token", done =>{
        let socket = io("http://localhost:9009", {
            query: ``
        });
        socket.on('connect', function(data){
            socket.disconnect();
            throw new Error("connected even though not supposed to")
        });

        socket.on("error", data =>{
            socket.disconnect()
            done();
        })
    });

});

describe("Socket Stuff", () =>{

    it("should be able to join room", (done) =>{

        let socket = io("http://localhost:9009", {
            query: `token=${token1}`
        });

        socket.on("connect", () =>{
            User.where({email: "1mike12@gmail.com"}).fetch()
            .then(user => Session.where({pupil_id: user.get("id")}).fetch())
            .then(session =>{
                socket.emit("joinRoom", {uuid: session.get('uuid')}, (response) =>{
                    done();
                });
            });
        });

        socket.on("error", () =>{
            throw new Error("socket error")
        })
    });

    it("should be able to send message to room", (done) =>{

        Session.where({pupil_id: userId1, teacher_id: userId2}).fetch()
        .then(session =>{
            if (!session) throw new Error("no session");

            let uuid = session.get("uuid");
            let ws1 = io("http://localhost:9009", {
                query: `token=${token1}`
            });


            let ws2 = io("http://localhost:9009", {
                query: `token=${token2}`
            });

            ws1.on("connect", () =>{
                ws1.emit("joinRoom", {uuid}, checkIfJoined);
            });

            ws2.on("connect", () =>{
                ws2.emit("joinRoom", {uuid}, checkIfJoined)
            });

            let connectCount = 0;

            //todo should be testing entire websocket, WEBRTC signaling procedure
            function checkIfJoined(status){
                connectCount++;
                if (connectCount === 2){
                    ws1.disconnect();
                    ws2.disconnect();
                    done()
                }
            }
        });
    })
});
