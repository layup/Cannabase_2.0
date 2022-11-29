const {contextBridge, ipcRenderer, ipcMain} = require('electron')
const CannabaseMgr = require('./database/CannabaseMgr')
const latexManger = require('./latex/latexManger')

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

const createNewJob = async (jobNum, clientName, tests, notes) => {
    return CannabaseMgr.createNewJob(jobNum, clientName, tests, notes);
}

const getTestStatus = async (jobNum, testNum) => {
    return CannabaseMgr.getTestStatus(jobNum, testNum)
}

const getAllClients = async () => {
    return CannabaseMgr.getAllClients();
}

const getNumberClients = async () => {
    return CannabaseMgr.getNumberClients(); 
}

const clientSearch = async (clientName) => {
    return CannabaseMgr.clientSearch(clientName)
}

const setTestsStatus = async (jobNum, testNum, status) => {
    return CannabaseMgr.setTestsStatus(jobNum, testNum, status)
}


const openFile = () => {
    return ipcRenderer.invoke('dialog:openFile')
} 

const setFilePath = (filePath) => {
    return ipcRenderer.invoke('dialog:setPath', filePath)
} 

const scanReportsFolder = (jobNum) => {
    return latexManger.scanReportsFolder(jobNum)
}

const openPDF = (jobNum) => {
    return latexManger.openPDF(jobNum);
}

const getStorePathLocations = () => {
    return CannabaseMgr.getStorePathLocations()
}




contextBridge.exposeInMainWorld("api", {
    createNewJob: createNewJob,  
    getNotComplete: getNotComplete, 
    getJobInfo: getJobInfo, 
    getTotalJobs: getTotalJobs, 
    getAllJobs: getAllJobs, 
    searchJobs: searchJobs, 
    getTests: getTests,
    setTestsStatus: setTestsStatus, 
    getTestStatus: getTestStatus,
    getAllClients: getAllClients, 
    getNumberClients: getNumberClients, 
    clientSearch: clientSearch,
    
    getStorePathLocations: getStorePathLocations, 
    openFile: openFile,
    setFilePath: setFilePath, 
    scanReportsFolder: scanReportsFolder, 
    openPDF: openPDF  
   
})
