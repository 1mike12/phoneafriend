const WebSocket = require("ws");
const port = require("../config").port;

const userID_1_Token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.Lw1IFiHNoXYUyWUIWIMCunNAunPGFNtxGsK76oFClc8";
const userID_2_Token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjJ9.7pWxwmRmTcOnCzrLd2brSrRxKuQuWSnp_X9ewmwJxk4";

describe("Socket Authentication", () =>{

    it("Authentication", (done) =>{
        let ws = new WebSocket(`ws://localhost:${port}`, {
            headers: {
                token: userID_1_Token
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

    it("should be able to join room", (done)=> {
        let ws = new WebSocket(`ws://localhost:${port}`, {
            headers: {
                token: userID_1_Token
            }
        });

        ws.on("open", ()=>{

            ws.send(JSON.stringify({
                type: "joinRoom",

            }))
            ws.on("message", (message)=>{
                console.log(message)
                done()
            })
        })
    })
});
