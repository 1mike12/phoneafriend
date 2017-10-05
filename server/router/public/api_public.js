const express = require("express");
const User = require("./../../models/User");
const router = express.Router();


router.post("/login", function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    const unsuccessfulLogin = {
        success: false,
        message: "wrong password or email"
    };

    if (email && password){
        User.where({email: email}).fetch()
        .then(function(user){
            let token = user.getTokenForPassword(password);

            if (token){
                res.send({
                    env: process.env.NODE_ENV,
                    token: token
                });
            } else {
                res.status(400);
                res.send(unsuccessfulLogin);
            }
        })
        .catch(User.NotFoundError, function(){
            res.status(400).send(unsuccessfulLogin);
        })
    } else {
        res.status(400);
        res.send({
            success: false,
            message: "no password or email"
        })
    }
});

router.post("/register", function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    const emailPattern = /.+\@.+\..+/;
    if (email && password && email.match(emailPattern) && password.length >= 5){
        User.where({email: email}).fetch()
        .then(function(user){

            if (user){
                res.status(400);
                res.send("user already exists")
            } else {
                let newUser = User.forge({email});
                newUser.setPassword(password);
                return newUser.save()
                .then(user =>{
                    let token = user.getTokenForPassword(password);
                    res.send({
                        env: process.env.NODE_ENV,
                        token: token
                    });
                })
            }
        })
    } else {
        res.status(400);
        res.send("invalid email or password")
    }
});

module.exports = router;