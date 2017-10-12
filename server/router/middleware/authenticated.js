const jwt = require("jsonwebtoken");
const config = require("../../config");
const _ = require("lodash");
const AuthenticationService = require("../../services/AuthenticationService");
const whitelistKeys = new Set();
whitelistKeys.add("iat");

module.exports = function(req, res, next){
    const path = req.originalUrl;

    if (path.indexOf("/api/public") === 0){
        return next();
    }

    const token = req.query.token || req.headers['token'] || req.body.token;
    if (token){
        AuthenticationService.authenticate(token)
        .then((payload) =>{
            //extend all token payload directly onto req object, unless it's collision
            _.forEach(payload, (value, key) =>{
                if (req.key === undefined && !whitelistKeys.has(key)){
                    req[key] = value
                } else {
                    throw new Error(`collsion with extending jwt token key and preexisting req key: ${key}`)
                }
            });
            // req.userId = payload.userId;
            return next();
        })
        .catch((err) =>{
            return res.status(400)
            .send({
                success: false,
                message: "failed to authenticate token"
            })
        });
    } else {
        return res.status(403).send({
            success: false,
            message: "no token"
        })
    }
};
