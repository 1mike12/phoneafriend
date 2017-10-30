const Session = require("../models/Session");
const User = require("../models/User");
const Promise = require('bluebird');
const io = require("socket.io-client");

let token1;
let token2;

let session;
let user1;
let user2;

before(async () =>{

    let u1 = User.forge();
    u1.setPassword("123");
    let u2 = User.forge();
    u2.setPassword("123");

    [user1, user2] = await Promise.all([
        u1.save(),
        u2.save()
    ])
    token1 = user1.getTokenForPassword("123");
    token2 = user2.getTokenForPassword("123");
    session = await Session.forge({pupil_id: user1.get("id"), teacher_id: user2.get("id")}).save()
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
                    socket.disconnect()
                    done();
                });
            });
        });

        socket.on("error", () =>{
            socket.disconnect()
            throw new Error("socket error")
        })
    });

    it("should be able to send message to room", (done) =>{

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

    })
});

after(async () =>{
    await session.destroy({softDelete: false})
    await Promise.all([user1.destroy({softDelete: false}), user2.destroy({softDelete: false})])
})