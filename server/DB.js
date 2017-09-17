const config = require("config");

class DB {
  constructor() {
    this.knex = this.getKnex();
    this.bookshelf = this.getBookshelf(this.knex);
  }

  getAppliedEnvironment() {
    let appliedEnvironment = (process.env.NODE_ENV) ? process.env.NODE_ENV : "development";
    return appliedEnvironment;
  }

  getKnex() {
    const knexfile = require("./knexFile")[this.getAppliedEnvironment()];
    if (!knexfile) throw new Error(`couldn't find knexfile for environment: ${this.getAppliedEnvironment()}`);
    return require('knex')(knexfile);
  }

  getBookshelf(knexInstance) {
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