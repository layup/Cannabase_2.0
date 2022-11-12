const CannabaseMgr = require('../database/CannabaseMgr')

const {contextBridge, ipcRenderer, ipcMain} = require('electron')



const getNotComplete = async () => {
    return  CannabaseMgr.getNotComplete(); 
}

const getJobInfo = async (jobNum) => {
    return CannabaseMgr.getJobInfo(jobNum); 
}

//works 
const test = () => {
    return ipcRenderer.invoke('hello-world').then((result) => {
        return result
    })
}

const openFile = () => {
    return ipcRenderer.invoke('dialog:openFile')
} 
const sendMessage = (msg) => {
    ipcRenderer.send('hello-message', msg)
}

const onCount = (callback) => {
    ipcRenderer.on('count', (event, args) => {
        callback(args); 
    })
}

contextBridge.exposeInMainWorld("api", {
    getNotComplete: getNotComplete, 
    getJobInfo: getJobInfo, 
    sendMessage: sendMessage,
    onCount: onCount,
    test: test,
    openFile: openFile
})