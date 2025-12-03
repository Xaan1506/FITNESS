const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'fittrack.db');

const db = new sqlite3.Database(DB_PATH);

const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
db.serialize(() => {
  db.exec(initSql, (err) => {
    if (err) console.error('DB init error', err);
    else console.log('Database initialized at', DB_PATH);
  });
});

module.exports = db;
