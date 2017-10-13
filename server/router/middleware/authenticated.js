const _ = require("lodash");
const AuthenticationService = require("../../services/AuthenticationService");
const WHITELISTED_HEADER_KEYS = new Set(["iat"]);

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
            // req.userId = payload.userId;
            _.forEach(payload, (value, key) =>{
                if (req.key === undefined && !WHITELISTED_HEADER_KEYS.has(key)){
                    req[key] = value
                } else {
                    throw new Error(`collision with extending jwt token key and preexisting req key: ${key}`)
                }
            });

            next();
            //to disable warning about runaway bluebird promises?? not really sure why this happens to begin with
            return null;
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
