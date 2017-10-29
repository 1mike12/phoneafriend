//top level because these have to work before all others
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

    it(`should delay execution by 1 second`, function(){
        const clock = sinon.useFakeTimers();

        return Promise.resolve()
        .then(() =>{
            return new Promise(function(resolve){
                setTimeout(resolve, 1000); // resolve never gets called
                clock.tick(1000);
            });
        })
        .then(() =>{
            let x = 0
        })
    });

    it("should be able to use timers", done =>{
        let x = 0;
        let clock = sinon.useFakeTimers()
        setTimeout(() =>{
            x = 1
        }, 10);


        expect(x).to.equal(0)
        clock.tick(1000)
        expect(x).to.equal(1)
        clock.restore()
        done();
    })
    it("async await and fake timers", async () =>{
        let clock = sinon.useFakeTimers()

        function getNumber(){
            return new Promise(function(resolve){
                setTimeout(resolve(1), 5000); // resolve never gets called
            });
        }

        let x = 0;
        x = await getNumber()
        clock.tick(5000)
        expect(x).to.equal(1)
        clock.restore()
    })
})