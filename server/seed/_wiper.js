let _ = require("lodash");
const knex = require("../DB").knex;

module.exports = new function(){
    const self = this;

    self.wipe = function(){

        return knex("checks").del()
        .then(function(){
            return knex("routes").del()
        })
        .then(function(){
            return knex("users").del()
        })
    };
};