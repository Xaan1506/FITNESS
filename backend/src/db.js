const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../fittrack.db");

const db = new Database(DB_PATH);

module.exports = db;
