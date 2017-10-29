let _ = require("lodash");
const knex = require("../DB").knex;
const fs = require("fs-promise");
const Promise = require("bluebird");

class Wiper {
    static wipe(){
        return fs.readdir("./migrations")
        .then(fileNames =>{
            //need to wipe in reverse migration order
            fileNames.reverse();
            let tableNames = [];

            let pattern = /\d*_(.*)\.js/;
            fileNames.forEach(fileName =>{
                let matches = pattern.exec(fileName);
                if (!matches) throw new Error("didn't find a matched table name");
                tableNames.push(matches[1]);
            });

            return Promise.mapSeries(tableNames, (fileName) =>{
                return knex(fileName).del()
            })

        })
    }
}

module.exports = Wiper;