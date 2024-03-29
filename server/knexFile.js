const config = require("./config");

const DB_NAME = config.databaseName;
const DB_NAME_TEST = config.databaseNameTest;

module.exports = {
    development: {
        client: 'pg',
        connection: {
            charset: 'utf8',
            host: "localhost",
            port: "5432",
            user: "mike",
            password: "123",
            database: DB_NAME_TEST
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true

    },

    development_production: {
        client: 'pg',
        connection: {
            charset: 'utf8',
            host: "miniguns.com",
            port: "5432",
            user: "mike",
            password: "tracRAPr6!eR",
            database: DB_NAME,
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true
    },

    test: {
        client: 'pg',
        connection: {
            charset: 'utf8',
            host: "localhost",
            port: "5432",
            user: "mike",
            password: "123",
            database: DB_NAME_TEST,
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: true

    },
    production: {
        client: 'pg',
        connection: {
            charset: 'utf8',
            host: "localhost",
            port: "5432",
            user: "root",
            password: "ua84zz5UWQFz",
            database: DB_NAME,
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './migrations/seeds'
        },
        debug: false

    }
};