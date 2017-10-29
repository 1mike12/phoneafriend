const Transaction = require("../../models/Transaction");
const Session = require("../../models/Session");
const User = require("../../models/User");
const Promise = require("bluebird");

let users;
let userA, userB, userC;
let session;
before(async () =>{
    users = User.forgeCollection([
        {email: "a"},
        {email: "b"},
        {email: "c"}
    ]);

    [userA, userB, userC] = await users.invokeThen("save");
    session = await Session.forge().save();
});

describe("Transaction", function(){

    describe("transacting", () =>{
        it("should reject non balancing transaction", async () =>{

            let userIdAmount = {
                "a": 100,
                "b": -90
            };

            try {
                await Transaction.insertTransaction("session_id", userIdAmount)
            }
            catch (e) {
                expect(e.message).to.contain("inserting transaction")
            }
        });

        it("should be able to create transaction", async () =>{
            let userIdAmount = {};
            userIdAmount[userA.get("id")] = 100;
            userIdAmount[userB.get("id")] = -20;
            userIdAmount[userC.get("id")] = -80;

            let transaction = await Transaction.insertTransaction(session.get("id"), userIdAmount);

            userA = await User.where({id: userA.get("id")}).fetch()
            userB = await User.where({id: userB.get("id")}).fetch()
            userC = await User.where({id: userC.get("id")}).fetch()

            expect(parseFloat(userA.get("credits"))).to.equal(100)
            expect(parseFloat(userB.get("credits"))).to.equal(-20)
            expect(parseFloat(userC.get("credits"))).to.equal(-80)

            transaction = await transaction.load("transactionEntries");
            expect(transaction.related("transactionEntries").length).to.be.equal(3)
        })
    })
});

after(async () =>{
    await Promise.all([userA, userB, userC].map(user => user.destroy({softDelete: false})));
    await session.destroy({softDelete: false});
});

