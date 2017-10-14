const SocketResponses = require("../../../shared/SocketResponse");

describe("SocketResponses", () =>{

    it("should be able to get", () =>{
        let incomingRequest = {type: "joinSession"}
        let matched = SocketResponses.fromRequest(incomingRequest);
        expect(matched).to.not.be.undefined;
    });

    it("should equal", () =>{
        expect(SocketResponses.LEAVE_SESSION.equals(SocketResponses.LEAVE_SESSION)).to.be.true;
        expect(SocketResponses.LEAVE_SESSION.equals(SocketResponses.JOIN_SESSION)).to.be.false;
    })

    it("should be able to match with direct equality", () =>{
        let matched = SocketResponses.fromRequest({type: "joinSession"});
        expect(matched === SocketResponses.JOIN_SESSION).to.be.true;
    })

    it ("should throw error if equals called on non instance", ()=>{
        let rawJson = {type: "joinSession"};
        let caught = false;
        try{
            SocketResponses.JOIN_SESSION.equals(rawJson)
        } catch(e){
            caught = true
        }
        expect(caught).to.be.true;
    })
});