let router = require("express").Router();
let Class = require("../models/TransactionEntry");
const moment = require("moment");

router.get("/", async (req, res, next) =>{
    const last30Days = moment().subtract(30, "days").toISOString()
    let transactions = await Class
    .where({user_id: req.userId})
    .where("created_at", ">", last30Days)
    .fetchAll({withRelated: ["transaction.session"]});
    res.send(transactions);
});

router.get("/all", async (req, res, next) =>{
    let transactions = await Class.where({
        user_id: req.userId,
    })
    .fetchAll({withRelated: ["transaction.session"]});
    res.send(transactions);
});

module.exports = router;