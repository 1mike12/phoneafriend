const BaseModel = require("./BaseModel");
const TABLE_NAME = "transactions";
const TransactionEntry = require("./TransactionEntry");
const Bookshelf = require("../DB").bookshelf;
const TransactionTypes = require("../../shared/TransactionTypes");

let Instance = new function(){
    let self = this;

    self.soft = false;
    self.tableName = TABLE_NAME;

    self.transactionEntries = function(){
        return this.hasMany(require('./TransactionEntry'))
    };

};

let Static = new function(){
    let self = this;


    /**
     * @param [session_id]
     * @param {object} userId_Amount
     * @param transactionType
     * @return {Promise.<transaction|Promise.<mixed>>} -inserted transaction
     */
    self.insertTransaction = async function(session_id, userId_Amount, transactionType){

        if (!transactionType || !userId_Amount) throw new Error("missing required params")

        //ensure balanced;
        let sum = 0;
        let entries = [];
        let userIds = [];

        for (let key in userId_Amount) {
            if (userId_Amount.hasOwnProperty(key)){
                userIds.push(key);
                sum += userId_Amount[key];

                entries.push({
                    user_id: key,
                    amount: userId_Amount[key]
                })
            }

        }

        return Bookshelf.transaction(async (transacting) =>{
            if (Math.abs(sum) > 0.00001) throw new Error(`inserting transaction that doesn't balance ${userId_Amount}`);

            let transaction = await Transaction.forge({session_id, type: transactionType}).save(null, {transacting});

            let promises = [];
            entries.forEach(entry =>{
                promises.push(transaction.related("transactionEntries").create(entry, {transacting}))
            });
            await Promise.all(promises);
            let users = await require("./User").where("id", 'in', userIds).fetchAll();
            users.forEach(user => user.set({credits: parseFloat(user.get("credits")) + userId_Amount[user.get("id")]}));
            await users.invokeThen("save", null, {transacting});
            return transaction;
        });
    };

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, (table) =>{
                table.increments().primary();

                table.integer("session_id")
                .unsigned().index()
                .references("id").inTable("sessions")
                .onUpdate("cascade").onDelete("cascade");

                table.enu("type", TransactionTypes.getTypesAsArray());

                table.timestamps();
            });

        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = Transaction = BaseModel.extend(Instance, Static);