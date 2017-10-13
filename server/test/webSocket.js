const WebSocket = require("ws");
const config = require("../config");

const port = process.env.NODE_ENV === "test" ? config.testPort : config.port;

const Session = require("../models/Session");
const User = require("../models/User");
const test = require("../seed/test");
const Promise = require('bluebird');

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

describe("Socket Authentication", () =>{

    it("Authentication", (done) =>{
        let ws = new WebSocket(`ws://localhost:${port}`, {
            headers: {
                token: token1
            }
        });

        ws.on('message', function incoming(data){
            expect(data).to.equal("connected");
            ws.close();
            done();
        });
    });

    it("Not authentiated", (done) =>{
        let ws = new WebSocket(`ws://localhost:${port}`, {});

        ws.on('message', function incoming(data){
            expect(data).to.equal("no token");
            ws.close();
            done();
        });
    })
});

describe("Socket Stuff", () =>{

    it("should be able to join room", (done) =>{

        let ws = new WebSocket(`ws://localhost:${port}`, {
            headers: {
                token: token1
            }
        });

        ws.on("open", () =>{
            User.where({email: "1mike12@gmail.com"}).fetch()
            .then(user => Session.where({pupil_id: user.get("id")}).fetch())
            .then(session =>{
                ws.send(JSON.stringify({
                    type: "joinSession",
                    uuid: session.get("uuid")
                }));
            });

            ws.on("message", (message) =>{
                if (message.includes("joined session")){
                    ws.close();
                    done()
                }
            })
        })
    });

    it("should be able to send message to room", (done) =>{

        Session.where({pupil_id: userId1, teacher_id: userId2}).fetch()
        .then(session =>{
            if (!session) throw new Error("no session");

            let uuid = session.get("uuid");
            let ws1 = new WebSocket(`ws://localhost:${port}`, {headers: {token: token1}});
            let ws2 = new WebSocket(`ws://localhost:${port}`, {headers: {token: token2}});

            let user1Joined = false;
            let user2Joined = false;

            const USER1_MESSAGE = "USER1_message";
            const USER2_MESSAGE = "USER2_message";

            function checkIfProceed(){
                if (user1Joined && user2Joined){
                    ws1.send(JSON.stringify({type: "sendMessage", uuid: uuid, message: USER1_MESSAGE}));
                    ws2.send(JSON.stringify({type: "sendMessage", uuid: uuid, message: USER2_MESSAGE}));
                }
            }

            let user1MessageReceived = false;
            let user2MessageReceived = false;

            let user1ReceivedSelfMessage = false;
            let user2ReceivedSelfMessage = false;

            function checkIfDone(){
                if (user1MessageReceived && user2MessageReceived){

                    expect(user1MessageReceived).to.be.true;
                    expect(user2MessageReceived).to.be.true;
                    expect(user1ReceivedSelfMessage).to.be.false;
                    expect(user2ReceivedSelfMessage).to.be.false;

                    ws1.close();
                    ws2.close();
                    done();
                }
            }

            ws1.on("open", () =>{
                ws1.send(JSON.stringify({
                    type: "joinSession",
                    uuid: uuid
                }));

                ws1.on("message", (message) =>{
                    if (message.includes("joined session")){
                        user1Joined = true;
                        checkIfProceed()
                    }

                    if (message.includes(USER2_MESSAGE)){
                        user2MessageReceived = true;
                        checkIfDone()
                    }

                    if (message.includes(USER1_MESSAGE)){
                        user1ReceivedSelfMessage = true;
                    }
                })
            });

            ws2.on("open", () =>{
                ws2.send(JSON.stringify({
                    type: "joinSession",
                    uuid: uuid
                }));

                ws2.on("message", (message) =>{
                    if (message.includes("joined session")){
                        user2Joined = true;
                        checkIfProceed()
                    }
                    if (message.includes(USER1_MESSAGE)){
                        user1MessageReceived = true;
                        checkIfDone()
                    }

                    if (message.includes(USER2_MESSAGE)){
                        user2ReceivedSelfMessage = true;
                    }
                })
            })
        });
    })
});
