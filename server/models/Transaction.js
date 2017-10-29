const BaseModel = require("./BaseModel");
const TABLE_NAME = "transactions";
const TransactionEntry = require("./TransactionEntry");
const User = require("./User");

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


    self.insertTransaction = function(session_id, userId_Amount){
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
        if (Math.abs(sum) > 0.00001) throw new Error(`inserting transaction that doesn't balance ${userId_Amount}`);

        return Transaction.forge({session_id}).save()
        .then(transaction =>{
            let promises = [];
            entries.forEach(entry =>{
                promises.push(transaction.related("transactionEntries").create(entry))
            });
            return Promise.all(promises);
        })
        .then(() => User.where("id", 'in', userIds).fetchAll())
        .then(users =>{
            users.forEach(user => user.set({credits: user.get("credits") + userId_Amount[user.get("id")]}));
            return users.invokeThen("save")
        })
    };

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table){
                table.increments().primary();

                table.integer("session_id")
                .unsigned().index()
                .references("id").inTable("sessions")
                .onUpdate("cascade").onDelete("cascade");

                table.timestamps();
            });

        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = Transaction = BaseModel.extend(Instance, Static);