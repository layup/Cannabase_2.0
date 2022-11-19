const {contextBridge, ipcRenderer, ipcMain} = require('electron')
const CannabaseMgr = require('./database/CannabaseMgr')

console.log('Preload Scripts Loaded');

const getNotComplete = async () => {
    return  CannabaseMgr.getNotComplete(); 
}

const getJobInfo = async (jobNum) => {
    return CannabaseMgr.getJobInfo(jobNum); 
}

const getTotalJobs = async () => {
    return CannabaseMgr.getTotalJobs();
}
const getAllJobs = async () => {
    return CannabaseMgr.getAllJobs(); 
}

const searchJobs = async (jobNum) => {
    return CannabaseMgr.searchJobs(jobNum);
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
    getTotalJobs: getTotalJobs, 
    getAllJobs: getAllJobs, 
    searchJobs: searchJobs, 
    getTests: getTests,
    setTestsStatus: setTestsStatus, 
    getTestStatus: getTestStatus,
    getAllClients: getAllClients, 
   
})
