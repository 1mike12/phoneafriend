const TABLE_NAME = "accpeted_sessions";

exports.up = function(knex, Promise){
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
    });
};

exports.down = function(knex, Promise){
    return knex.schema.dropTableIfExists(TABLE_NAME)
};
