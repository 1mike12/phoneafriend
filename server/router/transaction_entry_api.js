let router = require("express").Router();
let Class = require("../models/TransactionEntry");

router.get("/", async (req, res, next) =>{
    let transactions = await Class.where({user_id: req.userId}).fetchAll({withRelated: ["transaction"]});
    res.send(transactions);
});

module.exports = router;