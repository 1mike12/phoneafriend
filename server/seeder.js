const chalk = require("chalk");
let Promise = require("bluebird");
const commander = require("commander");
let _ = require("lodash");
const wiper = require("./seed/_wiper");

if (process.env.NODE_ENV === "production"){
    throw new Error("database override is turned on. Can't seed a database that is not dev!")
}

module.exports = seeder = new function(){
    const self = this;

    /**
     * for resetting if migrations get corrupted, run migrations after
     * @returns {*}
     */
    self.seedScheme = function(schemeName){
        const scheme = require("./seed/" + schemeName);
        return scheme.run()
    };

    commander
    .command('rs <scheme_name>')
    .action(function(scheme_name){
        self.seedScheme(scheme_name)
        .then(function(){
            success("ran scheme: " + scheme_name)
        })
        .catch(exit)
    });

    commander
    .command('wipe')
    .action(function(){
        wiper.wipe()
        .then(function(){
            success("wiped all database entries")
        })
        .catch(exit)
    });

};

function exit(text){
    if (text instanceof Error){
        chalk.red(console.error(text.stack));
    } else {
        chalk.red(console.error(text));
    }
    process.exit(1);
}

function success(text){
    if (text){
        console.log(text);
    }
    process.exit(0);
}

commander.parse(process.argv);