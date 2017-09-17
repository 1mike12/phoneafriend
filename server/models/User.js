/**
 * Created by mq1014703 on 3/27/17.
 */
const BaseModel = require("./BaseModel");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const TABLE_NAME = "users";
let Instance = new function() {
    let self = this;

    self.tableName = TABLE_NAME;
    self.hidden = ['password'];

    self.setPassword = function(pass) {
        this.set("password", passwordHash.generate(pass))
    };

    /**
     * returns token or null
     * @param password
     */
    self.getTokenForPassword = function(password) {
        if (passwordHash.verify(password, this.get("password"))) {
            const payload = JSON.stringify({
                userId: this.get("id")
            });

            const options = {};
            const token = jwt.sign(payload, config.jwtSecret, options);
            return token
        } else {
            return null
        }
    };
};

let Static = new function() {
    let self = this;

    self.MIGRATION = {
        up: (knex, Promise) => {
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table) {
                table.increments();
                table.string("email", 127).unique();
                table.boolean("email_verified").defaultTo(false);
                table.string("uuid").unique();
                table.string("user_name");
                table.string("password");
                table.string("confirmation_uuid");
                // table.specificType('geo', 'geometry(point, 4326)');

                table.string("phone_number");
                table.string("phone_confirmation");
                table.boolean("phone_verified").defaultTo(false);

                table.string("carrier");
                table.string("country");
                table.boolean("premium").defaultTo(false);

                table.json("settings");

                table.timestamps();
                table.dateTime("deleted_at");
            });
        },
        down: (knex, Promise) => {
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = User = BaseModel.extend(Instance, Static);