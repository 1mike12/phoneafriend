const SocketActions = require("../../../shared/SocketActions");

describe("SocketResponses", () =>{

    it("should be able to get", () =>{
        let incomingRequest = {type: "joinSession"}
        let matched = SocketActions.fromRequest(incomingRequest);
        expect(matched).to.not.be.undefined;
    });

    it("should equal", () =>{
        expect(SocketActions.LEAVE_SESSION.equals(SocketActions.LEAVE_SESSION)).to.be.true;
        expect(SocketActions.LEAVE_SESSION.equals(SocketActions.JOIN_SESSION)).to.be.false;
    })

    it("should be able to match with direct equality", () =>{
        let matched = SocketActions.fromRequest({type: "joinSession"});
        expect(matched === SocketActions.JOIN_SESSION).to.be.true;
    })

    it("should throw error if equals called on non instance", () =>{
        let rawJson = {type: "joinSession"};
        let caught = false;
        try {
            SocketActions.JOIN_SESSION.equals(rawJson)
        } catch (e) {
            caught = true
        }
        expect(caught).to.be.true;
    })

    it("should assign params", () =>{
        let request = SocketActions.JOIN_SESSION.request({foo: "bar"});
        let parsed = JSON.parse(request);
        expect(parsed.foo).to.equal("bar")
    })
});