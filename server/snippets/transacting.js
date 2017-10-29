const Bookshelf = require("../DB").bookshelf;
const User = require("../models/User");
const Session = require("../models/Session");

Bookshelf.transaction((transacting)=> {
    return User.forge({email: "poopsy3@mcgee.com"}).save(null, {transacting})
    .then(user=> {
        return Session.forge({pupil_id: user.get("id")}).save(null, {transacting})
    })
    .then(()=>{
        // return transacting.rollback()
        return transacting.commit()
    })

});