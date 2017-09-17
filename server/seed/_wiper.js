let _ = require("lodash");
const knex = require("../DB").knex;

module.exports = new function(){
    const self = this;

    self.wipe = function(){

        return knex("skills_users").del()
        .then(()=> knex("sessions_skills").del())
        .then(() => knex("sessions").del())
        .then(() => knex("skills").del())
        .then(() => knex("users").del())
    };
};