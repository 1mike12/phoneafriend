/**
 * Created by 1mike12 on 5/10/2017.
 */
const express = require("express");
const router = express.Router();

router.get("/ebay", (req, res, next) =>{
    let authCode = req.query.code;
    let stateObj = JSON.parse(new Buffer(req.query.state, 'base64').toString('ascii'));
    GmailAccount.handleCallback(authCode, stateObj.email)
    .then(function(account){
        res.send(account);
    })
    .catch(next)
});

router.get("/ebay/privacy-policy", (req, res, next) =>{

});

/**
 * redirect when user declines permissions
 */
router.get("/ebay/decline", (req, res, next) =>{

});

module.exports = router;