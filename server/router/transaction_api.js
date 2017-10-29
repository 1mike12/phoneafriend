let router = require("express").Router();
let Class = require("../models/Transaction");

// router.get("/", async (req, res, next) =>{
//     let transactions = await Class.fetchAll({withRelated: ["transactionEntries"]});
//     res.send(transactions);
// });

module.exports = router;