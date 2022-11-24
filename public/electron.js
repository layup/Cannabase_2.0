const { app, ipcMain, BrowserWindow, dialog, ipcRenderer } = require('electron');
const path = require('path');
//const url = require('url');
const Store = require('electron-store');
const isDev = require('electron-is-dev');


const store = new Store()

function createWindow() {   

    const win = new BrowserWindow({        
        width: 800,        
        height: 800,        
        //autoHideMenuBar: true,
        webPreferences: {            
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
  

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)

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


