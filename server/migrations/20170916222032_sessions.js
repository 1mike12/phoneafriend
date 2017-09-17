const TABLE_NAME = "sessions"
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
        table.increments().primary();

        table.integer("teacher_id")
        .unsigned().index()
        .references("id").inTable("users");

        table.integer("pupil_id")
        .unsigned().index()
        .references("id").inTable("users");

        table.timestamps();
        table.dateTime("deleted_at");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(TABLE_NAME)
};
