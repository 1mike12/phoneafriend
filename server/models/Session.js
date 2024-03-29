/**
 * Created by mq1014703 on 3/27/17.
 */
const BaseModel = require("./BaseModel");
const uuid1 = require("uuid/v1");

const TABLE_NAME = "sessions";
let Instance = new function(){
    let self = this;

    self.tableName = TABLE_NAME;

    self.initialize = function(){
        this.on("creating", (model, attrs, options) =>{
            if (!model.get("uuid")) model.set("uuid", uuid1())
        });
    };

    self.teacher = function(){
        return this.belongsTo(require("./User"), "teacher_id");
    };

    self.pupil = function(){
        return this.belongsTo(require('./User'), "pupil_id")
    };

    self.skills = function(){
        return this.belongsToMany(require("./Skill"))
    }

    self.addSkills = async function(skills){
        if (skills.length === undefined) skills = [skills];
        return await this.skills().attach(skills.map(skill => skill.get("id")))
    };

};

let Static = new function(){
    let self = this;

    /**
     * fetch a session only as a valid member of that session
     */
    self.getByUUIDAsMember = function(uuid, userId){
        return Session.query(qb =>{
            qb.where("uuid", uuid);
            qb.andWhere(function(){
                this.where("teacher_id", userId);
                this.orWhere("pupil_id", userId);
            })
        })
        .fetch()
    };

    self.MIGRATION = {
        up: (knex, Promise) =>{
            return knex.schema.createTableIfNotExists(TABLE_NAME, function(table){
                table.increments().primary();
                table.specificType("uuid", "uuid").unique();

                table.string("title");
                table.text("description");

                table.integer("teacher_id")
                .unsigned().index()
                .references("id").inTable("users");

                table.integer("pupil_id")
                .unsigned().index()
                .references("id").inTable("users");

                table.boolean("completed").default(false);
                table.specificType("teacher_rating", "smallint");
                table.specificType("pupil_rating", "smallint");
                table.timestamps();
                table.dateTime("deleted_at");
            });
        },
        down: (knex, Promise) =>{
            return knex.schema.dropTableIfExists(TABLE_NAME)
        }
    }
};

module.exports = Session = BaseModel.extend(Instance, Static);