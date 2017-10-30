/**
 * Created by mq1014703 on 3/27/17.
 */
const BaseModel = require("./BaseModel");

const TABLE_NAME = "transaction_entries";
let Instance = new function(){
    let self = this;
    self.soft = false;

    self.tableName = TABLE_NAME;

    self.user = function(){
        return this.belongsTo(require("./User"));
    }

    self.transaction = function(){
        return this.belongsTo(require("./Transaction"))
    }
};

let Static = new function(){
    let self = this;

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table){
                table.increments().primary();

                table.integer("transaction_id")
                .unsigned().index()
                .references("id").inTable("transactions")
                .onUpdate("cascade").onDelete("cascade");

                table.integer("user_id")
                .unsigned().index()
                .references("id").inTable("users")
                .onUpdate("cascade").onDelete("cascade");

                table.timestamps();
                table.decimal("amount");
            });
        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = TransactionEntry = BaseModel.extend(Instance, Static);