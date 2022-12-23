const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Store = require('electron-store');
const fs = require('fs')

const store = new Store()
//var dbPath = path.resolve(__dirname, './Cannabase.db')
let  dbPath = path.resolve(store.get('databaseLocation'));
//var dbPath3 = store.get('databaseLocation2');

const pathExists = () => {
  console.log('Stored SQL db Path: ', dbPath)
  if(fs.existsSync(dbPath)){
    console.log('Daatabase does exist')
    return dbPath
  }
  console.log('Database does not exist, creating temp in memory location')
  return ":memory:" 
}

const db = new sqlite3.Database(pathExists(dbPath), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE , (err) => {
    if (err){
      console.error('Database opening error: ', err);

    }else {
      console.log('Connected to the in-memory SQLite database');

    }
});

exports.db = db; 
