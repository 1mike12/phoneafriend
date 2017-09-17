//top level because these have to work before all others
describe("_sample", function () {

    beforeEach(function (done) {
        done();
    });

    it("should override the current path", function (done) {
        done()
    });
});

describe("_sample 2", function () {
    beforeEach(function (done) {
        done();
    });

    it("should be able to set and get", function (done) {
        expect("a").to.be.equal("a");
        done();
    });
});
