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


function generateData(){

}

async function openFileXlsx() {
    const { canceled, filePaths } = await dialog.showOpenDialog() 
    var fileName = filePaths[0].replace(/^.*[\\\/]/, ''); 

    //check if is an .xslx
    if(fileName.includes('.xlsx')){
        console.log('is xslx file')
    }

    //should be around 137 - 74 = 63 
    //total = 186 - 74 = 112
    
    //const maxRow = 137;
    //const minRow = 41;

    let headers = ['index', 'component', 'trace', 'RT' , 'BUD1', 'BUD2']

    //load an XSLX file into memory 
    //const wb = XLSX.readFile(filePaths[0], {sheetRows: maxRow});
    const wb = XLSX.readFile(filePaths[0]);
    //wb['!ref'] = "A74:B74" // change the sheet range to A2:C3
    console.log(wb.SheetNames)
    //select the first and only sheet to read 
    const ws = wb.Sheets[wb.SheetNames[0]];

    //don't know how many columns there will be before hand 
    
    let data = XLSX.utils.sheet_to_json(ws);
    let dataRows = Object.keys(data).length 

    console.log(typeof data); 
    //console.log(Object.keys(data));
    //console.log(Object.keys(data).length)
    
    data = data.slice((dataRows-1) - 112, dataRows - 10);
    //remove 3 random middle columns 64 - 66
    //easiser to parase past it 

    //console.log(Object.keys(data)); 
    dataRows = Object.keys(data).length 
    //0-102 
    //console.log(dataRows)
    //console.log(data)
    
    console.log(data[0])
    console.log(typeof data)
    console.log(typeof data[0])
    
    //data[0] bud locations 
    //data[]

    //console.log(Object.keys(data[0]))
    
    let budHeader = data[2]
    let budNames = data[1]
    let budLocations = []
    
   

    for (var key in budHeader) {
        //console.log(key + " -> " + temp[key]); 
        if(budHeader[key] === 'ng/g'){
            budLocations.push(key)
        }
    }
 
    console.log(budLocations)

    //get all the weed names 
    for(var key2 in budLocations){
        //console.log(key2)
        //console.log(budNames[budLocations[key2]])
    }

    //get the bud names 

    console.log("TESINGS")

    for (var key3 in budLocations){
        console.log(budNames[budLocations[key3]])
        data.forEach((item) => {
            if((typeof(item[budLocations[key3]]) !== "undefined") && (typeof(item.__EMPTY_1) !== 'undefined')){
                console.log(item.__EMPTY_1, item[budLocations[key3]])
            }

            
        })
    }
     

    //console.log(data[56])
    //console.log(Object.keys(data[56]).length)

    


    fs.writeFileSync('test.json',JSON.stringify(data))




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


    //const store = new schema({schema})
    //store.clear()

    

    //console.log("Stored SQL Database Path: ", store.get('databaseLocation'))
    //console.log("Stored Reports Path: ", store.get('reportsPath'))
    
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


