const {shell, ipcRenderer, BrowserWindow, dialog } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const path = require('path')

const store = new Store()

exports.scanReportsFolder = (jobNum) => {

    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)
    const regex = /.*.pdf/

    return new Promise((resolve, reject) => {

        let scanned_files = [] 

        if(fs.existsSync(currentPath)){
            fs.readdir(currentPath, (err, files) => {
                files.forEach(file => {
                
                    if(scanned_files.includes(file) === false){
                        if(regex.test(file)){
                            scanned_files.push(file)
                            //console.log('hello')
                            resolve(scanned_files)
                            //console.log(scanned_files)
                        } 
                    }
       
                });
            });
        }
    })
}

//read local dir and find the files that we need 
exports.openPDF = (jobNum, report) => {
    // Load a remote URL
    
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)

    shell.openExternal('file://' + path.join(currentPath, report))

} 

exports.openFileXlsx = async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog()
}