const {contextBridge, ipcRenderer, ipcMain} = require('electron')
const CannabaseMgr = require('./database/CannabaseMgr')
const excelManager = require('./excel/excelManager')


console.log('Preload Scripts Loaded');

const getNotCompleteJobs = async () => {
    return  CannabaseMgr.getNotCompleteJobs(); 
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



const temp = () => {
    let test = {
        "Abamectin": "60.48",
        "Acephate": "18.00",
        "Acequinocyl": "26.30",
        "Acetamiprid": "6.09",
        "Aldicarb": "51.36",
        "Allethrin": "47.41",
        "Azadirachtin": "695",
        "Azoxystrobin": "7.34",
        "Benzovindiflupyr": "5.06",
        "Bifenazate": "7.25",
        "Bifenthrin": "9.28",
        "Boscalid": "7.63",
        "Buprofezin": "5.77",
        "Carbaryl": "48.85",
        "Carbofuran": "6.46",
        "Chlorantraniliprole": "7.77",
        "Chlorphenapyr": "40.40",
        "Chlorpyrifos": "8.57",
        "Clofentezine": "6.69",
        "Clothianidin": "6.62",
        "Coumaphos": "6.34",
        "Cyantraniliprole": "5.38",
        "Cyfluthrin": "180",
        "Cypermethrin": "53.07",
        "Cyprodinil": "9.74",
        "Daminozide": "89.70",
        "Deltamethrin": "20.70",
        "Diazinon": "6.97",
        "Dichlorvos": "9.19",
        "Dimethoate": "6.85",
        "Dimethomorph": "4.50",
        "Dinotefuran": "32.20",
        "Dodemorph": "10.00",
        "Endosulfan-alpha": "30.00",
        "Endosulfan-beta": "5.00",
        "Endosulfan-sulfate": "5.00",
        "Ethoprophos": "7.35",
        "Etofenprox": "10.74",
        "Etoxazole": "6.80",
        "Etridiazole": "26.00",
        "Fenoxycarb": "7.18",
        "Fenpyroximate": "11.07",
        "Fensulfothion": "7.00",
        "Fenthion": "8.57",
        "Fenvalerate": "60.8",
        "Fipronil": "9.13",
        "Flonicamid": "7.45",
        "Fludioxonil": "15.47",
        "Fluopyram": "6.37",
        "Hexythiazox": "6.85",
        "Imazalil": "5.29",
        "Imidacloprid": "5.57",
        "Iprodione": "490",
        "Kinoprene": "50.00",
        "Kresoxim-methyl": "5.79",
        "Malathion": "11.88",
        "Metalaxyl": "8.28",
        "Methiocarb": "11.50",
        "Methomyl": "7.02",
        "Methoprene": "8.00",
        "Methyl parathion": "25.00",
        "Mevinphos": "7.02",
        "MGK-264": "22.80",
        "Myclobutanil": "6.80",
        "Naled (Dibrom)": "7.48",
        "Novaluron": "5.30",
        "Oxamyl": "26.30",
        "Paclobutrazol": "7.60",
        "Permethrin": "35.80",
        "Phenothrin": "45.40",
        "Phosmet": "10.40",
        "Piperonyl butoxide": "47.40",
        "Pirimicarb": "6.50",
        "Prallethrin": "17.85",
        "Propiconazole": "5.30",
        "Propoxur": "10.65",
        "Pyraclostrobin": "6.70",
        "Pyrethrin I": "19.80",
        "Pyrethrin II": "49.40",
        "Pyridaben": "7.70",
        "Quintozene": "20.00",
        "Resmethrin": "22.10",
        "Spinetoram": "6.70",
        "Spinosad": "6.60",
        "Spirodiclofen": "16.20",
        "Spiromesifen": "6.50",
        "Spirotetramat": "11.20",
        "Spiroxamine": "7.20",
        "Tebuconazole": "5.50",
        "Tebufenozide": "10.30",
        "Teflubenzuron": "7.80",
        "Tetrachlorvinphos": "6.70",
        "Tetramethrin": "72.20",
        "Thiacloprid": "6.60",
        "Thiamethoxam": "10.50",
        "Thiophanate-methyl": "6.60",
        "Trifloxystrobin": "6.30",
        "Aflatoxin B1": "0.030",
        "Aflatoxin B2": "0.015",
        "Aflatoxin G1": "0.030",
        "Aflatoxin G2": "0.015",
        "Ochratoxin": "0.030",
        "Zearalenone": "0.030"
        }

    
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
    temp: temp
   
})
