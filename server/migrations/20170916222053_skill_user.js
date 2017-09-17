const TABLE_NAME = "skill_user"
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
        table.increments().primary();

        table.integer("user_id")
        .unsigned().index()
        .references("id").inTable("users");

        table.integer("skill_id")
        .unsigned().index()
        .references("id").inTable("skills");

        table.timestamps();
        table.dateTime("deleted_at");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(TABLE_NAME)
};
