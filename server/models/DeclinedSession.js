const BaseModel = require("./BaseModel");

const TABLE_NAME = "declined_sessions";
let Instance = new function(){
    let self = this;

    self.hasTimestamps = false;
    self.soft = null;
    self.tableName = TABLE_NAME;
};

let Static = new function(){
    let self = this;

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table){
                table.increments().primary();

                table.integer("user_id")
                .unsigned().index()
                .references("id").inTable("users")
                .onUpdate("cascade").onDelete("cascade");

                table.integer("session_id")
                .unsigned().index()
                .references("id").inTable("sessions")
                .onUpdate("cascade").onDelete("cascade");

                table.unique(["user_id", "session_id"])
            });

        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = BaseModel.extend(Instance, Static);