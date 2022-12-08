const {contextBridge, ipcRenderer, ipcMain} = require('electron')
const CannabaseMgr = require('./database/CannabaseMgr')
const excelManager = require('./excel/excelManager')


console.log('Preload Scripts Loaded');

const getNotCompleteJobs = async () => {
    return CannabaseMgr.getNotCompleteJobs(); 
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

const getJobNotes = async(jobNum) => {
    return CannabaseMgr.getJobNotes(jobNum);
}
const updateNotes = async(jobNum, note) => {
    return CannabaseMgr.updateNotes(jobNum, note )
}

const createNewJob = async (jobNum, clientName, tests, notes) => {
    return CannabaseMgr.createNewJob(jobNum, clientName, tests, notes);
}
const deleteJob = async(jobNum) => {
    return CannabaseMgr.deleteJob(jobNum);
}
const setJobStatus = async(jobNum, status) => {
    return CannabaseMgr.setJobStatus(jobNum, status); 
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

const getClientJobs = async (clientName) => {
    return CannabaseMgr.getClientJobs(clientName)
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
const openFileXlsx = () => {
    return ipcRenderer.invoke('dialog:openFilexslx'); 
    //return excelManager.openFileXlsx();
}
const setFilePath = (filePath) => {
    return ipcRenderer.invoke('dialog:setPath', filePath)
} 

const scanReportsFolder = (jobNum) => {
    return excelManager.scanReportsFolder(jobNum)
}

const openPDF = (jobNum, report ) => {
    return excelManager.openPDF(jobNum, report);
}

const getStorePathLocations = () => {
    return CannabaseMgr.getStorePathLocations()
}

const processExcelFile = (reportType, filePath) => {
    return excelManager.processExcelFile(reportType, filePath)
}

const processTxt = (jobNumbers) => {
    return excelManager.processTxt(jobNumbers)
}


contextBridge.exposeInMainWorld("api", {
    createNewJob: createNewJob,  
    deleteJob: deleteJob, 
    setJobStatus: setJobStatus, 
    getNotCompleteJobs: getNotCompleteJobs, 
    getJobInfo: getJobInfo, 
    getClientJobs: getClientJobs, 
    getTotalJobs: getTotalJobs, 
    getAllJobs: getAllJobs, 
    searchJobs: searchJobs, 
    getTests: getTests,
    setTestsStatus: setTestsStatus, 
    getTestStatus: getTestStatus,
    getAllClients: getAllClients, 
    getNumberClients: getNumberClients, 
    getJobNotes: getJobNotes, 
    updateNotes: updateNotes, 
    clientSearch: clientSearch,
    
    getStorePathLocations: getStorePathLocations, 
    openFile: openFile,
    setFilePath: setFilePath, 
    scanReportsFolder: scanReportsFolder, 
    openPDF: openPDF, 
    openFileXlsx: openFileXlsx,

    processExcelFile: processExcelFile, 
    processTxt: processTxt
   
})
