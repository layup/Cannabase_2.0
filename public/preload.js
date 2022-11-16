const CannabaseMgr = require('../database/CannabaseMgr')

const {contextBridge, ipcRenderer, ipcMain} = require('electron')



const getNotComplete = async () => {
    return  CannabaseMgr.getNotComplete(); 
}

const getJobInfo = async (jobNum) => {
    return CannabaseMgr.getJobInfo(jobNum); 
}

const getTests = async (jobNum) => {
    return CannabaseMgr.getTests(jobNum)
}
const getTestStatus = async (jobNum, testNum) => {
    return CannabaseMgr.getTestStatus(jobNum, testNum)
}

const getAllClients = async () => {
    return CannabaseMgr.getAllClients();
}

const setTestsStatus = async (jobNum, testNum, status) => {
    return CannabaseMgr.setTestsStatus(jobNum, testNum, status)
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
    getTests: getTests,
    setTestsStatus: setTestsStatus, 
    getTestStatus: getTestStatus,
    getAllClients: getAllClients,
})