const {shell } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const url = require('url');
const path = require('path')
var readline = require('readline');

const {generateThcReport, processThcFile} = require('./cannabisReportMngr')
const {genereatePestReport, processPestFile} = require('./pestReportMngr')

const { promises: fs2 } = require("fs");
const store = new Store()

/** 
 * Scans reports folder that is saved in the Store 
 * @param   {string} jobNum - The file path of the THC excel file 
 * @return  {array} The scanned report files 
*/ 
exports.scanReportsFolder = (jobNum) => {

    var reportsDir = store.get('reportsPath')
    var currentPath = path.normalize(path.join(reportsDir, jobNum))


    return new Promise((resolve, reject) => {

        let scanned_pdf = [] 
        let scanned_xlsx = []
        

        if(fs.existsSync(currentPath)){
            fs.readdir(currentPath, (err, files) => {
                files.forEach(file => {

                    if(file.includes('.pdf')){
                        scanned_pdf.push(file)
                    }
                    if(file.includes('.xlsx')){
                        //scanned_xlsx.push(file) 
                        scanned_pdf.push(file)
                    }
       
                });
                console.log(scanned_pdf)
                console.log(scanned_xlsx)
                resolve(scanned_pdf)
            });
        }


    })
}


/**
 * 
 * @typedef {Object} GoodCopies 
 * @property {string} filePath - file path of the good copies 
 * @property {string} fileName - the file name of good copies 
 */

/**
 * Scans the good copies folder and looks for finished copies based on jobNumber 
 * @param {string} jobNumber 
 * @returns {GoodCopies} 
 */
exports.scanGoodCopies = (jobNumber) => {

    let reportDir = store.get('goodReportsPath'); 

    console.log('scanning for good copies')
    console.log(jobNumber)
    console.log(reportDir)
    
    let jobLocation = jobNumber.substring(0,3)
    let jobEnding = jobNumber.slice(-4)

    return new Promise((resolve, reject) => {
        

        let scanned_paths = fs.readdir(path.normalize(reportDir),  (err, files) => {
            files.forEach((yearFolder => {
                if(yearFolder.includes("A-Z")){

                    fs.readdir(path.join(reportDir, yearFolder), (err, file2) => {
                        file2.forEach((jobFolder) => {

                            if(jobFolder.includes(jobLocation)){
                                let tempPath = path.join(reportDir, yearFolder, jobFolder)
                                
                                fs.readdir(tempPath, (err, file3) => {
                                    
                                    let fileName = file3.find(location => location.includes(jobEnding))
                                    let filePath = path.join(tempPath, fileName)
                                    resolve({
                                        filePath, 
                                        fileName
                                    })

                                    
                                } )

                            }
                        } )
                    })


                }
            }))
        });
        console.log('scanned path')
        console.log(scanned_paths)
     
    

    })
    

}


/** 
 * Opens the PDF on the local machines default .pdf reader 
 * @param   {String} jobNum - the job number of the pdf 
 * @param   {String} report - the name of the report         
*/ 
exports.openPDF = (jobNum, report) => {
    // Load a remote URL
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)

    shell.openExternal('file://' + path.join(currentPath, report))

} 

exports.openGoodCopies = (fileLocation) => {
    shell.openExternal('file://' + fileLocation)
}

//edit the excel files from the thing
//scan for .xlsx files 
exports.editFile = (jobNum, report) => {
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)

    shell.openExternal('file://' + path.join(currentPath, report))
}



exports.scanImages = (jobNum) => {

    return new Promise((resolve, reject) => {
        let imageDir = store.get('imagePath')    

        fs.readdir(path.normalize(imageDir),  (err, files) => {
            let images = files.filter(item => item.includes(jobNum))

            let imagesPath = []

            images.forEach((image) => {
                imagesPath.push('file://' + path.join(imageDir, image))
            })

            resolve(imagesPath)
           
           
        });


    })
}


/**
 * Generate the folder and excel file from existing excel template 
 * @param {String} jobNumber - the job number
 * @param {String} fileExtension - the file extension 
 * @param {String} templateLocation - the location of the given template for the report type 
 * @returns {Object} - Where each jobs file is located 
 */
const generateFileNames = async (jobNumber, fileExtension, templateLocation, option) => {

    const reportsPath = store.get('reportsPath')

    const folderName = path.join(reportsPath + "/" + jobNumber.substring(0,6)) 
    let fileName; 

    if(option === 'single'){
        fileName = path.join(jobNumber + fileExtension)
    }else{
        fileName = path.join(jobNumber.substring(0,6) + fileExtension)
    }
     
    const fileLocation =  path.join(folderName + "/" + fileName) 

    if (!fs.existsSync(folderName)){
        fs.mkdirSync(folderName);
    }
    
    fs.copyFile(templateLocation, fileLocation, (err) => {
    if (err) throw err;
        //console.log(`Template (${fileExtension})copied to ${folderName}: ${jobNumber}`);

    });
    
    return {[jobNumber]: fileLocation}

}

//need to add option for single or multi-report 
const copyTemplate = async (jobNumberSample, reportType, option) => { 
    const templatesPath = store.get('templatesPath'); 
    //console.log(jobNumberSample, reportType)

    const templateNames = {
        thc: 'cannabis_template.xlsx', 
        pest: 'pesticides_template.xlsx', 
        toxins: 'toxins_template.xlsx'
    }

    let pestTemplate = path.join(templatesPath, templateNames['pest']) 
    let toxinsTemplate = path.join(templatesPath, templateNames['toxins']) 
    let thcTemplate = path.join(templatesPath, templateNames['thc']) 

    if(reportType === 'both'){
        let toxinsFileLocations = await generateFileNames(jobNumberSample, '_Toxins_report.xlsx', toxinsTemplate, option) 
        let pestFileLocations =  await generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate, option )

        return ( ({[jobNumberSample]: [toxinsFileLocations, pestFileLocations]}))
            
    }

    if(reportType === 'pest'){
        
        return (generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate, option))
    }

    if(reportType === 'toxins'){
            return ((generateFileNames(jobNumberSample, '_Toxins_report.xlsx', toxinsTemplate, option)))
    }

    if(reportType === 'basic' || reportType === 'deluxe'){
        return( (generateFileNames(jobNumberSample, '_THC_report.xlsx', thcTemplate, option)))
    }


}



exports.generateReports =  async (clientInfo, sampleNames, sampleData , jobNumbers, sampleOptions, reportType) => { 
   
    console.log('----Generating Reports Backend----')
    console.log(clientInfo)
    console.log(sampleNames)
    console.log(sampleData)
    console.log(sampleOptions)
    console.log(jobNumbers)
    console.log('----------------------------------')
    
    new Promise(async (resolve, reject) => {

        let fileLocations ={}

        //if there are mutluple pest files we generate 
        //check client info if there are two things 
        

        for(let key in sampleOptions){
            console.log('test:', key)
            if(sampleOptions.hasOwnProperty(key)){

                //if there are multiple pest samples 

                let tempObject =  await copyTemplate(key, sampleOptions[key]['reportType'], sampleOptions[key].amount)
                fileLocations[key] = tempObject[key]
                
            }
        }

        if(reportType === 'pesticides'){
            //do something checky here so if it has multiple of the document we will create 2 
            
            await genereatePestReport(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
            
        }

        if(reportType === 'cannabis'){
          
            await generateThcReport(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
        }
    
    })

}

/** 
 * Processes the excel file based on the report type 
 * @param  {string} reportType - either pesticides or cannabis. 
 * @param  {string} filePath - the file path of the excel file. 
 * @return {object} An object that contains the job numbers, sample names and the sample data. 
*/ 
exports.processExcelFile = (reportType, filePath) => {

    console.log(`Processing Excel File(${reportType}): ${filePath} `) 

    if(reportType === 'pesticides'){
        return processPestFile(filePath)
    }else {
        return processThcFile(filePath)
    }

}

/**
 * Processes the TXT files at the defined dir which scans for information based on a job number 
 * @param {Array} jobNumbers - All of the job numbers in the excel file 
 * @returns {Object} Contains the information of each job number if exists 
 */
exports.processTxt = async (jobNumbers) => {
    console.log("-----------Processing Text-------------")
    console.log(jobNumbers)
    const txtPath = path.normalize(store.get('txtPath'))
    
    let txtNames = []
    let regex = /TXT-.*/

    //scan the dir 
    const dirResults = await fs2.readdir(txtPath)

    //console.log(jobNumbers)
    //console.log(dirResults)
    
    //scan for TXT-MONTH files 
    dirResults.forEach((file) => {
        if(file.match(regex)){
            txtNames.push(file)
            console.log('TXT FILE: ', file)
        }
    })

    let clientPath = {}
    let selectedNumbers = []

    console.log('--Testing Processing Text Information--')
    
 
    //check for the file location and if they exists 
    for(let i = 0; i < jobNumbers.length; i++){
        for(let j = 0; j < txtNames.length; j++) {
            let newPath = path.join(txtPath, txtNames[j],"W"+ jobNumbers[i] + ".txt"); 
        
            if(fs.existsSync(path.normalize(newPath))){
                //console.log('newPath: ', newPath)
                clientPath[jobNumbers[i]] = newPath; 
                selectedNumbers.push(jobNumbers[i])
            }
        }    
    }
 
    let difference = []

    if(jobNumbers.length >= 1){
         difference = jobNumbers.filter(x => !selectedNumbers.includes(x));
    }


    let clientInfo = {}

    
    for(var clientKey in clientPath){
        clientInfo[clientKey] = await GenerateClientData(clientKey, clientPath[clientKey])
    }

    if(difference.length > 0 ){

        //generate empty data 
        console.log('difference: ', difference)

        //determine how many samples there are 

        for(let j = 0; j < difference.length; j++){
            console.log(difference[j])
            clientInfo[difference[j]] = {  
                jobNum: "", 
                clientName: "", 
                date: "", 
                time: "", 
                attention: "", 
                addy1: "", 
                addy2: "",
                addy3: "", 
                sampleType1: "", 
                sampleType2: "", 
                numSamples: "",
                recvTemp: "", 
                paymentInfo: "", 
                telephone: "",
                fax: "",  
                email: "",
                sampleNames: {}
            }
        }
    
    }

    console.log("--------Done Processing Text-----------") 
    return clientInfo
} 

/**
 * Scans for general information about a given job number 
 * @param {String} jobNum - the job number 
 * @param {String} jobPath - the path for the job number 
 * @returns {Object} contains all of the client information for a given job 
 */

const  GenerateClientData = async (jobNum, jobPath) => {

    console.log("--------Generating Client Data---------")

    let clientName, date, time = ""
    let attention = ""
    let addy1, addy2, addy3 = ""
    let sampleType1, sampleType2, numSamples = ""
    let recvTemp = ""
    let paymentInfo = ""
    let telephone, fax = ""
    let email = "" 
    let sampleNames = {}

    var instream = fs.createReadStream(jobPath)
    var rl = readline.createInterface(instream); 

    let counter = 0; 
    let sampleCounter = 0; 

    for await (const line of rl){       
        if(line.length > 0 ) {
            //console.log(`${line.length}: ${line}` )

            if(counter === 0){
                try {
                    clientName = line.match(/(\s{5})(.*?)(\s{5})/)[0].trim()
                    date = line.match(/[0-9]{2}[a-zA-Z]{3}[0-9]{2}/)[0]
                    time = line.substring(65,73).trim()
                } catch (err){
                    console.log(err)
                }

                
            }
            if(counter === 1){
                attention = line.match(/\*(.*?)(?=\s{3})/)

                const headerSplit = line.split("   ").filter(String)
                
                if(line.length > 25 && headerSplit.length === 2){
                     //sampleType1 = (line.substring(line.length/2,line.length)).match(/\w+/)[0];
                     sampleType1 = headerSplit[1].trim()
                }

                if(attention){
                    attention = attention[0] 
                    
                }else {
                    try {
                        addy1 = headerSplit[0].trim()
                    } catch (err){
                        console.log(err)
                    }
                   
                }

            }
            if(counter === 2 ){ 
                sampleType2 = (line.substring(line.length/2,line.length)).match(/(\w+)?([a-zA-Z0-9\-#]+)/)[0]; 
                if(attention){
                    try {
                        addy1 = (line.substring(0, line.length/2)).match(/\w+(\s\w+){2,}/)[0];
                    } catch (err) {
                       console.log(err)
                    }
                    
                }else {
                    addy2 = line.substring(0, line.length/2).trim()
                }
            
            }
            if(counter === 3){
                numSamples = line.substring(line.length/2, line.length).trim() 
                if(attention){
                    addy2 = line.substring(0, line.length/2).trim()
                }else{
                    addy3 = line.substring(0, line.length/2).trim()
                }
                
            }

            if(counter === 4){ 
                if(attention && addy2){
                   //addy3 = line.replace(/\s/g, '');
                    addy3 = line.substring(0,10).trim(); 
                }else {
                    telephone = line.substring(20,50).replace('TEL:', '').trim() 
                    try {
                        recvTemp = line.match(/((\d+).[\d]C)/)[0]
                    }catch (err){
                        console.log(err)
                    }
                    
                }
            }

            if(line.includes('FAX:')){
                fax = line.replace('FAX:', '').trim();
            }
            if(line.includes('TEL:')){
                telephone = line.substring(20,50).replace('TEL:', '').trim()
                try {
                    recvTemp = line.match(/((\d+).[\d]C)/)[0]
                }catch (err){
                    console.log(err)
                } 
            }
            if(line.includes('@')){
                try{
                    email = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)[0]
                } catch (err) {
                    console.log(err)
                }
            }
            if(line.includes('PD')){
                try {
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)[0]
                } catch (err){
                    console.log(err)
                }
               
            }
            if(line.includes('Pd')){
                try {
                    paymentInfo = line.match(/(Pd) (\w+) (\w+)/)[0]
               } catch (err){
                   console.log(err)
               }
            
            }
           
            counter++; 
        } 

        if(counter > 7 && line.length > 0 ){

            if(sampleCounter !== parseInt(numSamples)){
                let sampleMatch = line.match(/(?<=\s[1-9] ).*/)
                if(sampleMatch){
                    sampleMatch  = sampleMatch[0].replace(/\s\s+/g, ' ');
                    sampleNames[`${jobNum}-${sampleCounter+1}`] = sampleMatch.trim()
                    sampleCounter++; 
                }
            }
        }

    }

    
    return {
        jobNum: jobNum, 
        clientName: clientName, 
        date: date, 
        time: time, 
        attention: attention, 
        addy1: addy1, 
        addy2: addy2,
        addy3: addy3, 
        sampleType1: sampleType1, 
        sampleType2: sampleType2, 
        numSamples: numSamples,
        recvTemp: recvTemp, 
        paymentInfo: paymentInfo, 
        telephone: telephone,
        fax: fax,  
        email: email,
        sampleNames:sampleNames 
    }
}
