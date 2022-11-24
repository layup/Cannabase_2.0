const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Store = require('electron-store');

const store = new Store()
var dbPath = path.resolve(__dirname, './Cannabase.db')
var dbPath2 = store.get('databaseLocation');

console.log('Stored SQL dbPath: ', dbPath2)

const db = new sqlite3.Database(dbPath2, sqlite3.OPEN_READWRITE, (err) => {
    if (err){
      console.error('Database opening error: ', err);
    }else {
      console.log('Connected to the in-memory SQLite database');
    }
});

exports.db = db; 
