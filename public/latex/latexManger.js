const {shell, ipcRenderer } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const path = require('path')

const store = new Store()

exports.scanReportsFolder = (jobNum) => {

    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)
    const regex = /.*.pdf/

    return new Promise((resolve, reject) => {
        fs.readdir(currentPath, (err, files) => {
            files.forEach(file => {
            //console.log(file)
            if(regex.test(file)){
                resolve(file)
            }
            
            });
        });
    })
}

//read local dir and find the files that we need 
exports.openPDF = (jobNum) => {
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)
    const regex = /.*.pdf/ 

    fs.readdir(currentPath, (err, files) => {
        files.forEach(file => {
        //console.log(file)
        
        if(regex.test(file)){
            //console.log(__dirname)
            //console.log(path.join(currentPath, file))
            shell.openExternal('file://' + path.join(currentPath,file))
        }});
    });
} 