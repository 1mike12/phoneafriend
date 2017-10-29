/**
 * Created by mq1014703 on 3/27/17.
 */
const BaseModel = require("./BaseModel");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const config = require("../config");
const uuid1 = require("uuid/v1");

const TABLE_NAME = "users";
let Instance = new function(){
    let self = this;

    self.tableName = TABLE_NAME;
    self.hidden = ['password', "last_name"];

    self.virtuals = {
        last_initial: function(){
            return this.get("last_name").substring(0, 1)
        }
    };

    self.initialize = function(){
        this.on("creating", (model, attrs, options) =>{
            model.set("uuid", uuid1())
        });
    };


    self.setPassword = function(pass){
        this.set("password", passwordHash.generate(pass))
    };

    /**
     * returns token or null
     * @param password
     */
    self.getTokenForPassword = function(password){
        if (passwordHash.verify(password, this.get("password"))){
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

    self.skills = function(){
        return this.belongsToMany(require('./Skill'))
    };

    self.alertSessionAsTeacher = function(session){
        console.log("ok")
    }
};

let Static = new function(){
    let self = this;

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table){
                table.increments();
                table.string("email", 127).unique();
                table.boolean("email_verified").defaultTo(false);
                table.specificType("uuid", "uuid").unique();
                table.string("first_name");
                table.string("last_name");
                table.string("profile_url");
                table.string("password");
                table.string("confirmation_uuid");
                // table.specificType('geo', 'geometry(point, 4326)');

                table.string("phone_number");
                table.string("phone_confirmation");
                table.boolean("phone_verified").defaultTo(false);

                table.string("carrier");
                table.string("country");
                table.boolean("premium").defaultTo(false);
                table.decimal("credits").defaultTo(0);

                table.json("settings");

                table.timestamps();
                table.dateTime("deleted_at");
            });
        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = User = BaseModel.extend(Instance, Static);