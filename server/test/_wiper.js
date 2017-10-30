// const Wiper = require("../seed/_wiper");
//
// const User = require("../models/User");
//
// describe("should be able to wipe the user table", () =>{
//     it("wipe", () =>{
//         return User.forge({first_name: "scroopy_nooper"}).save()
//         .then(() =>{
//             return User.where({first_name: "scroopy_nooper"}).fetch()
//         })
//         .then((user) =>{
//             expect(user).to.not.be.undefined;
//             return Wiper.wipe();
//         })
//         .then(() =>{
//             return User.fetchAll()
//         })
//         .then(users =>{
//             expect(users.length).to.equal(0)
//         })
//     })
// });