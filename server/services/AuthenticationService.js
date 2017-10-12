const jwt = require("jsonwebtoken");
const config = require("../config");
const Promise = require('bluebird');

const verify = Promise.promisify(jwt.verify);
module.exports = {
    /**
     * @param token
     * @returns Promise <Object> resolving in {} payload of the decoded token (what was stored in signed jwt token)
     */
    authenticate: function(token){
        return verify(token, config.jwtSecret)
    }
};