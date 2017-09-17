const express = require("express");
const User = require("./../../models/User");
const router = express.Router();


router.post("/", function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    const unsuccessfulLogin = {
        success: false,
        message: "wrong password or email"
    };

    if (email && password) {
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

module.exports = router;