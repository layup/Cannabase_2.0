const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Store = require('electron-store');

const store = new Store()
var dbPath = path.resolve(__dirname, './Cannabase.db')
//var dbPath2 = path.normalize(store.get('databaseLocation'));
var dbPath2 = store.get('databaseLocation2');

try {
  dbPath2 = path.normalize(dbPath2)
} catch (error){
  console.log(error)
  dbPath2 = path.normalize('./temp.db')

}


console.log('Stored SQL dbPath:', dbPath2)

const db = new sqlite3.Database(dbPath2, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE , (err) => {
    if (err){
      console.error('Database opening error: ', err);

    }else {
      console.log('Connected to the in-memory SQLite database');

    }
});

exports.db = db; 
