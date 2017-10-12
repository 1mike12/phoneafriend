const WebSocket = require("ws");
const port = require("../config").port;

describe("Socket", () =>{

    it("authenticating", () =>{
        let ws = new WebSocket(`ws://localhost:${port}`, {
            headers: {
                token: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.Lw1IFiHNoXYUyWUIWIMCunNAunPGFNtxGsK76oFClc8"
            }
        });

        ws.on('message', function incoming(data){
            expect(data).to.equal("connected");
            ws.close();
            done();
        });
    })
});

