const { electron, app, ipcMain, BrowserWindow, dialog, ipcRenderer } = require('electron');
const path = require('path');
//const url = require('url');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const fs = require('fs')


const store = new Store()


function createWindow() {   

    const win = new BrowserWindow({        
        width: 800,        
        height: 800,        
        //autoHideMenuBar: true,
        webPreferences: {            
            enableremotemodule: true,
            webSecurity: false,
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
    console.log(filePaths[0])

    if (canceled) {
      return
    } else {
      store.set('databaseLocation', filePaths[0])
      console.log("New Database Path:", store.get('databaseLocation'))
     
      return filePaths[0]
      
    }
  }

async function handleSetFilePath(setFile) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })

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

    let validFile = false; 

    if(fileName.includes('.xlsx')){
        validFile = true; 
    }

    return {validFile: validFile, fileName: fileName, filePath: filePaths[0]}
    
}

function printer(url){
    
    
    var options = {
        silent: false,
        printBackground: true,
        color: false,
        margin: {
            marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: 'Header of the Page',
        footer: 'Footer of the Page'
    }

    
    console.log('Printer Backend Running')
    //console.log('Files: ', data) 

    
    const win = new BrowserWindow({ 
        width: 480, 
        height: 640, 
        webPreferences: {
            nativeWindowOpen: true
        }
    })
    
    win.loadURL('www.google.com')

    app.on('did-finish-load', () => {
        win.webContents.print(options, (success, failureReason) => {
            if (!success) console.log(failureReason);
            console.log('Print Initiated');
        });
    });
    
}

app.whenReady().then(() => {

    console.log('Your App Path:' +  app.getAppPath())

    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('dialog:openFilexslx', openFileXlsx)
    ipcMain.handle('dialog:setPath',  async (event, ...args) => {
        const results = await handleSetFilePath(...args)
        return results 
    })
    ipcMain.handle('dialog:printer', async (event, ...args) => {
        printer(...args)
    })
    
  
    const schema = {
        databaseLocation: {
            type: 'string',
            description: 'Path for SQL database'
        },
        txtPath: {
            type: 'string',
            description:'Path for TXT-Month'
        }, 
        goodCopiesPath: {
            type:'string', 
            description: 'Path for the Good Copies and COCs'
        }, 
        reportsPath : {
            type:'string', 
            description: 'Path for the reports for jobs'
        }, 
        imagePath: {
            type:'string', 
            description: 'Path for the images for each job '
        }
        
    };

    
    createWindow()
});

app.on('window-all-closed', () => {    
    if (process.platform !== 'darwin') {        
        app.quit()    
    }
});
app.on('activate', () => {    
    // On macOS it's common to re-create a window in the 
    // app when the dock icon is clicked and there are no 
    // other windows open
    if (BrowserWindow.getAllWindows().length === 0) {        
        createWindow()    
    }
});

