const sqlite3 = require('sqlite3').verbose();
const path = require('path');

var dbPath = path.resolve(__dirname, './Cannabase.db')
console.log(dbPath)

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err){
      console.error('Database opening error: ', err);
    }else {
      console.log('Connected to the in-memory SQLite database');
    }
});

exports.db = db; 
