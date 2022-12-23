const {shell, ipcRenderer, BrowserWindow, dialog, remote, } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const path = require('path')
const xlsx = require('xlsx')
const Excel = require('exceljs');
var readline = require('readline');


const { promises: fs2 } = require("fs");

const store = new Store()

exports.scanReportsFolder = (jobNum) => {

    var reportsDir = store.get('reportsPath')
    var currentPath = path.normalize(path.join(reportsDir, jobNum))
    const regex = /.*.pdf/

    return new Promise((resolve, reject) => {

        let scanned_files = [] 

        if(fs.existsSync(currentPath)){
            fs.readdir(currentPath, (err, files) => {
                files.forEach(file => {
                
                    if(scanned_files.includes(file) === false){
                        if(regex.test(file)){
                            scanned_files.push(file)
                            //console.log('hello')
                            resolve(scanned_files)
                            //console.log(scanned_files)
                        } 
                    }
       
                });
            });
        }
    })
}

//read local dir and find the files that we need 
exports.openPDF = (jobNum, report) => {
    // Load a remote URL
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)

    shell.openExternal('file://' + path.join(currentPath, report))

} 

//edit the excel files from the thing
//scan for .xlsx files 
exports.editFile = (jobNum) => {

}

const generateFileNames = async (jobNumber, fileExtension, templateLocation) => {

    const reportsPath = store.get('reportsPath')

        const folderName = path.join(reportsPath + "/" + jobNumber.substring(0,6)) 
        const fileName = path.join(jobNumber.substring(0,6) + fileExtension)
        const fileLocation =  path.join(folderName + "/" + fileName) 

        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName);
        }
        
        fs.copyFile(templateLocation, fileLocation, (err) => {
        if (err) throw err;
            console.log(`Template (${fileExtension})copied to ${folderName}: ${jobNumber}`);

        });
        
        return {[jobNumber]: fileLocation}

}


const copyTemplate =  (jobNumberSample, reportType) => { 
    const templatesPath = store.get('templatesPath'); 
    //console.log(jobNumberSample, reportType)

    const templateNames = {
        thc: 'cannabis_template.xlsx', 
        pest: 'particles_template.xlsx', 
        toxic: 'toxins_template.xlsx'
    }

    let pestTemplate = path.join(templatesPath, templateNames['pest']) 
    let toxicTemplate = path.join(templatesPath, templateNames['toxic']) 
    let thcTemplate = path.join(templatesPath, templateNames['thc']) 

        if(reportType === 'both'){
            let toxicFileLocations =  generateFileNames(jobNumberSample, '_Toxic_report.xlsx', toxicTemplate) 
            let pestFileLocations =  generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate)

            return ( ({[jobNumberSample]: [toxicFileLocations, pestFileLocations]}))
        }

        if(reportType === 'pest'){
            return (generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate))
        }

        if(reportType === 'toxic'){
             return ((generateFileNames(jobNumberSample, '_Toxic_report.xlsx', toxicTemplate)))
        }

        if(reportType === 'thc'){
            return( (generateFileNames(jobNumberSample, '_THC_report.xlsx', thcTemplate)))
        }

}

const copyClientInfo = async (worksheet, clientInfo, key) => {

    var row = worksheet.getRow(2)
    row.getCell(2).value = clientInfo[key].clientName
    row = worksheet.getRow(3)
    row.getCell(2).value = clientInfo[key].date 
    row = worksheet.getRow(4)
    row.getCell(2).value = clientInfo[key].time 
    row = worksheet.getRow(5)
    row.getCell(2).value = parseInt(clientInfo[key].jobNum)
    row = worksheet.getRow(6)
    row.getCell(2).value = clientInfo[key].sampleType1 
    row = worksheet.getRow(7)
    row.getCell(2).value = clientInfo[key].sampleType2
    row = worksheet.getRow(8)
    row.getCell(2).value = clientInfo[key].attention 
    row = worksheet.getRow(9)
    row.getCell(2).value = clientInfo[key].addy1 
    row = worksheet.getRow(10)
    row.getCell(2).value = clientInfo[key].addy2 
    row = worksheet.getRow(11)
    row.getCell(2).value = clientInfo[key].addy3 
    row = worksheet.getRow(12)
    row.getCell(2).value = parseInt(clientInfo[key].numSamples)
    row = worksheet.getRow(13)
    row.getCell(2).value = clientInfo[key].email
    row = worksheet.getRow(14)
    row.getCell(2).value = clientInfo[key].telephone 
    row = worksheet.getRow(15)
    row.getCell(2).value = clientInfo[key].recvTemp
    row = worksheet.getRow(16)
    row.getCell(2).value = clientInfo[key].paymentInfo

    row.commit(); 
}

const copyPestData = async (worksheet, worksheet2, clientInfo, sampleData, sampleNames, options, jobName) => {
    let sampleName = ''
    let sampleType = ''
    let counter = 1;  
    let row, row2; 

    console.log('Coping Pestcides/Toxic Data')
    //console.log(clientInfo[jobName]['sampleNames'])

    //set the given sample names and sample type
    for(let [key, value ] of Object.entries(clientInfo[jobName]['sampleNames'])){
        sampleName += `${counter}) ${value} `  
        sampleType = options.toxins 
        counter++; 
    }
    row = worksheet.getRow(27) 
    row.getCell(2).value = sampleName

    row = worksheet.getRow(28)
    row.getCell(2).value = sampleType

    row = worksheet.getRow(30)
    switch(sampleType) {
        case 'oil':
            row.getCell(2).value = 'oil'
            break;
        case 'paper':
            row.getCell(2).value = 'paper'
            break;
        default:
            row.getCell(2).value = 'bud'
    } 

    row.commit(); 

    let matchingSamples = []

    for(let i = 0; i < sampleNames.length; i++){ 
        if(sampleNames[i].substring(0,6) === jobName){
            matchingSamples.push(sampleNames[i])
        }
    }
    if(matchingSamples.length === 2){
        row2 = worksheet2.getRow(1)
        row2.getCell(8).value = 'Sample 2'
    }

    for(let j = 0; j < matchingSamples.length; j++){ 

        if(Object.keys(sampleData[matchingSamples[j]])){

            for(const [key2, value2] of Object.entries(sampleData[matchingSamples[j]])){
                //console.log(parseInt(key2), parseFloat(value2))
                
                let locaiton = (parseInt(key2) + 1)
                
                 row2 =  worksheet2.getRow(locaiton)
                
                row2.getCell((7 + j)).value = parseInt(value2)
                row2.commit()
               
            }
        }
    }

}

//void function, should probably try and split it out among different things 
const copyPestInfo = async (fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => { 

    //set either for Toxins, Pestices or Both
    console.log('Copying Pesticides Data')

    for(const [key, value] of Object.entries(sampleOptions)){
        console.log(key,value)
        if(value['toxins'] === 'both'){
            //console.log(fileLocations[key])

            for(let i = 0; i < fileLocations[key].length; i++){
                
            }

        }else{ 
            console.log(fileLocations[key])

            var wb = new Excel.Workbook(); 
            await wb.xlsx.readFile(fileLocations[key])
            let headersWorksheet = wb.getWorksheet('Headers'); 
            let dataWorksheet = wb.getWorksheet('Data')

            await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))
            await copyPestData(headersWorksheet, dataWorksheet, clientInfo, sampleData, sampleNames,  sampleOptions[key], key.substring(0,6))
            await wb.xlsx.writeFile(fileLocations[key]);

            console.log('Done writing')
            
        }
    }

}

exports.generateReports =  async (clientInfo, sampleNames, sampleData , jobNumbers, sampleOptions, reportType) => { 
   
    console.log('Generating Reports Backend ')
    console.log(clientInfo)
    console.log(sampleNames)
    console.log(sampleData)
    console.log(sampleOptions)
    console.log(jobNumbers)
    
    new Promise(async (resolve, reject) => {

        if(reportType === 'pesticides'){
            let fileLocations = {}

            //check if single or multi before 

            //check each before copy template 
            for(let key in sampleOptions){
                if(sampleOptions.hasOwnProperty(key)){
                    let tempObject =  await copyTemplate(key, sampleOptions[key]['toxins'])
                    fileLocations[key] = tempObject[key]
                }
            }

            await copyPestInfo(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
          
            //copy pest information to the thing
            
        }

        if(reportType === 'cannabis'){

        }
    
    })

}

const processPestFile = (filePath) => {
    return new Promise((resolve, reject) => {

        const wb = xlsx.readFile(path.normalize(filePath))
        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length 

        //check the length of the DataRows 
        //we keep on creating dataRows based on how large the size is 

        //1 page worth = 122 
        if(dataRows > 150){

        }
        console.log(dataRows)

        data = data.slice((dataRows-1) - 112, dataRows - 1);
        //data = data.slice(0, dataRows-1)

        
    
        let budHeader = data[2]
        let budNames = data[1]
        let budLocations = []
        let jobNumbers = []
        let samples = []
        let sampleData = {}

        for (var key in budHeader) {
            if(budHeader[key] === 'ng/g'){
                budLocations.push(key)
            }
        }
        console.log(budLocations)
    
        //get all the unique job numbers
        for(var key2 in budLocations){
            samples.push(budNames[budLocations[key2]])
            let jobNumber = budNames[budLocations[key2]].substring(0,6)

            if(!jobNumbers.includes(jobNumber)){
                jobNumbers.push(jobNumber)
            }
        }
    
        for (let i = 0; i < budLocations.length; i++){
            
            let tempData  ={}

            data.forEach((item) => {
                if((typeof(item[budLocations[i]]) !== "undefined") && (typeof(item.__EMPTY_1) !== 'undefined')){
                    //console.log(item.__EMPTY_1, item[budLocations[i]])
                    tempData[item.__EMPTY_1] = item[budLocations[i]]
                    //sort as object with location and amount 

                }
            })

            sampleData[budNames[budLocations[i]]] = tempData

        }
        
        //fs.writeFileSync('test.json',JSON.stringify(data))

        resolve({jobNumbers: jobNumbers, samples: samples, sampleData: sampleData})
    }) 
}

const processThcFile = (filePath) => { 

    console.log("Procesing THC file ")

    return new Promise((resolve, reject) => {

        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(path.normalize(filePath)).then(function() {
            let ws = workbook.getWorksheet("Sheet1")
            let cell = ws.getCell('AD78').value
            console.log(cell)
        });



    })
}

//scan throught xlsx file for thc/pest files 
exports.processExcelFile = (reportType, filePath) => {

    console.log('Processing Excel File: ', filePath) 

    if(reportType === 'pesticides'){
        return processPestFile(filePath)
    }else {
        return processThcFile(filePath)
    }

}


exports.processTxt = async (jobNumbers) => {
    console.log("Processing Text")
    const txtPath = path.normalize(store.get('txtPath'))
    
    let txtNames = []
    let regex = /TXT-.*/

    //scan the dir 
    const dirResults = await fs2.readdir(txtPath)
    console.log(dirResults)
    

    //scan for TXT-MONTH files 
    dirResults.forEach((file) => {
        //check the month name that's how we can select

        if(file.match(regex)){
            txtNames.push(file)
            console.log('TXT FILE: ', file)
        }
    })

    let clientPath = {}
    let selectedNumbers = []
 
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
    //issue when doesn't exist 

    let difference = jobNumbers.filter(x => !selectedNumbers.includes(x));
    
    let clientInfo = {}
    
    for(var clientKey in clientPath){
        clientInfo[clientKey] = await GenerateClientData(clientKey, clientPath[clientKey])

    }

    if(difference.length > 0){
        //generate empty data 

        console.log(difference)
    
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
    
    return clientInfo
} 



const  GenerateClientData = async (jobNum, jobPath) => {

    //console.log("Generating Client Data")

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
        
        if(line.length !== 0) {

            if(counter === 0){
                clientName = line.match(/(\s{5})(.*?)(\s{5})/)[0].trim()
                date = line.match(/[0-9]{2}[a-zA-Z]{3}[0-9]{2}/)[0]
                //time = line.match(/[0-9]{2}:[0-9]{2}[ap]/)[0]
                time = line.substring(65,73).trim()
                
            }
            if(counter === 1){
                attention = line.match(/\*(.*?)(?=\s{3})/)
                sampleType1 = (line.substring(line.length/2,line.length)).match(/\w+/)[0];
                
                if(attention){
                    attention = attention[0] 
                }else {
                    addy1 = (line.substring(0, line.length/2)).match(/\w+(\s\w+){2,}/)[0];
                }

            }
            if(counter === 2 ){ 
                sampleType2 = (line.substring(line.length/2,line.length)).match(/(\w+)?([a-zA-Z0-9\-#]+)/)[0]; 
                if(attention){
                    addy1 = (line.substring(0, line.length/2)).match(/\w+(\s\w+){2,}/)[0];
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
                if(attention){
                   addy3 = line.replace(/\s/g, '');
                }else {
                    telephone = line.substring(20,50).replace('TEL:', '').trim()
                    recvTemp = line.match(/((\d+).[\d]C)/)[0]
                }
            }

            if(counter === 5 ){
                if(attention){
                     telephone = line.substring(20,50).replace('TEL:', '').trim()
                     recvTemp = line.match(/((\d+).[\d]C)/)[0]
                 }else{
                    fax = line.replace('FAX:', '').trim();
                 }
            }

            if(counter === 6){ 
                if(attention){
                    fax = line.replace('FAX:', '').trim(); 
                }else {
                    //email = line.substring(20,50).trim()
                    email = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)[0]
                    
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        paymentInfo = paymentInfo[0]
                    }
                }

            }
            if(counter === 7){
                if(attention){
                    //email = line.substring(20,50).trim()
                    email = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)[0]
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        paymentInfo = paymentInfo[0]
                    } 
                }
            }

            counter++; 
        } 

        if(counter > 7){
            if(sampleCounter !== parseInt(numSamples)){
                let sampleMatch = line.match(/(?<=[1-9] ).*/)
                if(sampleMatch){
                    sampleMatch  = sampleMatch[0].replace(/\s\s+/g, ' ');
                    sampleNames[`${jobNum}-${sampleCounter+1}`] = sampleMatch
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