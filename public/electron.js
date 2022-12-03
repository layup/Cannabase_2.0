const { app, ipcMain, BrowserWindow, dialog, ipcRenderer } = require('electron');
const path = require('path');
//const url = require('url');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const XLSX = require('xlsx')
const fs = require('fs');

const store = new Store()

function createWindow() {   

    const win = new BrowserWindow({        
        width: 800,        
        height: 800,        
        //autoHideMenuBar: true,
        webPreferences: {            
            enableremotemodule: true,

            nodeIntegration: true,
            contextIsolation: true, 
            preload:path.join(__dirname, 'preload.js')
        }    
    });

    //console.log("dirname: ", __dirname); 

    win.maximize();    

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );

    //let count = 0;

    //setInterval(() =>{
    //    win.webContents.send("count", count++); 
    //}, 1000 )

    win.webContents.send("test" );

    //open the dev tools 
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
    app.on('window-all-closed', () => {        
        if (process.platform !== 'darwin') {            
            app.quit()        
        }    
    });
}


async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    console.log('running')

    if (canceled) {
      return
    } else {
      store.set('databaseLocation', filePaths[0])
      console.log("New Database Path: ", store.get('databaseLocation'))
     
      return filePaths[0]
      
    }
  }

async function handleSetFilePath(setFile) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    console.log(setFile)

    if (canceled) {
      return
    } else {
      store.set(setFile, filePaths[0])
      console.log(`New ${setFile} Path`, store.get(setFile))
     
      return filePaths[0]
      
    }
  }

async function openFileXlsx() {
    const { canceled, filePaths } = await dialog.showOpenDialog() 
    var fileName = filePaths[0].replace(/^.*[\\\/]/, ''); 

    //check if is an .xslx
    if(fileName.includes('.xlsx')){
        console.log('is xslx file')
    }

    const maxRow = 182;
    const minRow = 75;

    const wb = XLSX.readFile(filePaths[0], {sheetRows: maxRow});
    const ws = wb.Sheets[wb.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(ws);
    data = data.slice(minRow <= 2 ? 0 : minRow - 2);
    console.log(data);
    fs.writeFileSync('test.json',JSON.stringify(data))


    /*
    const file = reader.readFile(filePaths[0])
    let data = []
    const sheets = file.SheetNames
    console.log(sheets[0])

    for(let i = 0; i < sheets.length; i++){
        const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
    }

    console.log(data)
    */

    console.log(filePaths[0])
    console.log(fileName)

    return fileName
}



app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('dialog:openFilexslx', openFileXlsx)
    ipcMain.handle('dialog:setPath',  async (event, ...args) => {
        const results = await handleSetFilePath(...args)
        return results 
    })
    ipcMain.handle('dia')

    const schema = {
        databaseLocation: {
            type: 'string',
            description: 'Path for SQL database'
        },
        BenchLocation: {
            type: 'string',
            description:'Path for benchsheets and COCs'
        }, 
        clientCopiesLocaton: {
            type:'string', 
            description: 'Path for the Good Copies and COCs'
        }
    };

    
    console.log("Stored SQL Database Path: ", store.get('databaseLocation'))
    console.log("Stored Reports Path: ", store.get('reportsPath'))
    
    createWindow()
});

app.on('window-all-closed', () => {    
    if (process.platform !== 'darwin') {        
        app.quit()    
    }
});
app.on('activate', () => {    
    if (BrowserWindow.getAllWindows().length === 0) {        
        createWindow()    
    }
});


