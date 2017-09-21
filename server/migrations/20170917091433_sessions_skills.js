const TABLE_NAME = "sessions_skills"
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
        table.increments().primary();

        table.integer("session_id")
        .unsigned().index()
        .references("id").inTable("sessions")
        .onUpdate("cascade").onDelete("cascade");


        table.integer("skill_id")
        .unsigned().index()
        .references("id").inTable("skills")
        .onUpdate("cascade").onDelete("cascade");

    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(TABLE_NAME)
};
