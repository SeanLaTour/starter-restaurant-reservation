/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://zyyyfrle:RIWHnzQgf2Pr0ByabV6wOW-wcA599ufm@kashin.db.elephantsql.com:5432/zyyyfrle",
  DATABASE_URL_DEVELOPMENT = "postgres://gxibbhor:wpieDZwkaG7qWBc-W7S7QexF1nPWQGKz@kashin.db.elephantsql.com:5432/gxibbhor",
  DATABASE_URL_TEST = "postgres://dgyiuqcw:5xGMMvm8hh-kimDML9HBTDbwAgMoFcoX@kashin.db.elephantsql.com:5432/dgyiuqcw",
  DATABASE_URL_PREVIEW = "postgres://cdrkykow:986b9Z8KD-k4RnC6QH8t0rIgZedOg3mD@kashin.db.elephantsql.com:5432/cdrkykow",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
