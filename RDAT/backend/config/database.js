const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const usingSQLite = true;
const dbPath = path.join(__dirname, '..', 'refugio.db');
const connection = new sqlite3.Database(dbPath);

console.log('Using SQLite database');

module.exports = { connection, usingSQLite };