const TABLE_NAME = "skills_users"
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
        table.increments().primary();

        table.integer("user_id")
        .unsigned().index()
        .references("id").inTable("users")
        .onUpdate("cascade").onDelete("cascade");


        table.integer("skill_id")
        .unsigned().index()
        .references("id").inTable("skills")
        .onUpdate("cascade").onDelete("cascade");

        table.timestamps();
        table.dateTime("deleted_at");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(TABLE_NAME)
};
