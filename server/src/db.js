const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL CHECK (price > 0),
      condition TEXT CHECK (condition IN ('bon', 'moyen', 'mauvais')) NOT NULL
    )
  `);
});

module.exports = db;


