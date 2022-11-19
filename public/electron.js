const { app, ipcMain, BrowserWindow, dialog, ipcRenderer } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

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

    console.log("dirname: ", __dirname); 

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
    console.log(filePaths[0])
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  }
  

app.whenReady().then(() => {
    ipcMain.on('hello-messsage', (event, args) => {
        console.log(args); 
    })
    ipcMain.handle('dialog:openFile', handleFileOpen)

    ipcMain.handle('hello-world', () => {
        return "Hello World"
    })

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


