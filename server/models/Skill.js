/**
 * Created by mq1014703 on 3/27/17.
 */
const BaseModel = require("./BaseModel");

const TABLE_NAME = "skills";
let Instance = new function() {
    let self = this;

    self.tableName = TABLE_NAME;

    self.users = function() {
        return this.belongsToMany(require("./User"));
    }
};

let Static = new function() {
    let self = this;

    self.MIGRATION = {
        up: (knex, Promise) => {
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
                table.increments().primary();
                table.string("name");

                table.timestamps();
                table.dateTime("deleted_at");
            });
        },
        down: (knex, Promise) => {
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = Skill = BaseModel.extend(Instance, Static);