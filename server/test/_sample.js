//top level because these have to work before all others
// let sandbox;
//
// beforeEach(() =>{
//     sandbox = sinon.sandbox.create();
//     // sandbox.stub(global, 'setTimeout', setImmediate);
// })
//
// afterEach(() =>{
//     sandbox.restore();
// })
describe("_sample", function(){

    beforeEach(function(done){
        done();
    });

    it("should override the current path", async () =>{

    });
});

describe("_sample 2", function(){
    beforeEach(function(done){
        done();
    });

    it("should be able to set and get", function(done){
        expect("a").to.be.equal("a");
        done();
    });
});

describe("async await and fake timers", () =>{

    async function asyncAwait(){
        let x = 1;
        await new Promise(function(resolve){
            setTimeout(() => resolve(), 5000);
        })
        return x;
    }

    it(`normal promises`, async function(){
        let clock = sinon.useFakeTimers();
        let x = 0;
        let promise = new Promise(function(resolve){
            setTimeout(() => resolve(2), 5000);
        })
        .then((x) =>{
            return expect(x).to.equal(2)
        })

        clock.tick(1001);
        clock.restore();
    });

    it("use external async", () =>{
        let clock = sinon.useFakeTimers();

        asyncAwait()
        .then(x =>{
            expect(x).to.equal(1)
        })

        clock.tick(5000);
        clock.restore();
    })

    // it(`takes 2 real seconds`, async function(){
    //     let x = await new Promise((resolve) =>{
    //         setTimeout(() => resolve(1), 2000);
    //     })
    //     expect(x).to.equal(1)
    // });
    //
    // it(`takes 0 seconds`, async function(){
    //     let clock = sinon.useFakeTimers();
    //     let x = await  new Promise((resolve) =>{
    //         setTimeout(() => resolve(1), 2000);
    //         clock.tick(2000)
    //     })
    //     clock.restore()
    //     expect(x).to.equal(1)
    // });
})