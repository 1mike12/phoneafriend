const User = require("./../models/User");
const Route = require("./../models/Route");

module.exports = dev = new function(){
    let self = this;

    self.users = function(){
        let user = User.forge({
            email: "1mike12@gmail.com",
        });
        user.setPassword("123");
        return user.save();
    };

    self.run = function(){
        return self.users()
    }
};