const env = require("./env");

class DB {
    constructor(){
        this.knex = this.getKnex();
        this.bookshelf = this.getBookshelf(this.knex);
    }

    static getAppliedEnvironment(){
        let envActual = process.env.NODE_ENV;
        if (envActual === "production") return "production";

        if (envActual === "development" && env){
            return env;
        }

        return envActual ? envActual : "development";
    }

    getKnex(){
        const knexfile = require("./knexFile")[DB.getAppliedEnvironment()];
        if (!knexfile) throw new Error(`couldn't find knexfile for environment: ${DB.getAppliedEnvironment()}`);
        return require('knex')(knexfile);
    }

    getBookshelf(knexInstance){
        const bookshelf = require('bookshelf')(knexInstance);
        bookshelf.plugin("registry");
        bookshelf.plugin("visibility");
        bookshelf.plugin("virtuals");
        bookshelf.plugin(require("bookshelf-soft-delete"));
        bookshelf.plugin(require("bookshelf-strip-save"));
        bookshelf.plugin(require("bookshelf-json-columns"));
        bookshelf.plugin('pagination');
        return bookshelf;
    }
}

module.exports = new DB();