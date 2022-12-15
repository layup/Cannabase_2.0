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


const generateFileNames = (jobNumbers, fileExtension, templateLocation) => {

    const reportsPath = store.get('reportsPath')

    let fileLocations = [] 

    for(var i = 0; i < jobNumbers.length; i++ ){ 

        const folderName = path.join(reportsPath + "/" + jobNumbers[i]) 
        const fileName = path.join(jobNumbers[i] + fileExtension)
        const fileLocation =  path.join(folderName + "/" + fileName) 

        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName);
        }
        fs.copyFile(templateLocation, fileLocation, (err) => {
            if (err) throw err;
            console.log(`Template (${fileExtension})copied to ${folderName}`);
        });

        fileLocations.push({[jobNumbers[i]]: fileLocation})

    }   
    return fileLocations

}

const copyTemplate = (jobNumbers, reportType) => { 
    const templatesPath = store.get('templatesPath'); 

    console.log(templatesPath)
    console.log(reportType)

    const templateNames = {
        thc: 'cannabis_template.xlsx', 
        pest: 'particles_template.xlsx', 
        toxic: 'toxins_template.xlsx'
    }

    return new Promise((resolve, reject) => {

        let pestTemplate = path.join(templatesPath, templateNames['pest']) 
        let toxicTemplate = path.join(templatesPath, templateNames['toxic']) 
        let thcTemplate = path.join(templatesPath, templateNames['thc']) 

        if(reportType === 'both'){
            let toxicFileLocations = generateFileNames(jobNumbers, '_Toxic_report.xlsx', toxicTemplate) 
            let pestFileLocations = generateFileNames(jobNumbers, '_Pesticides_report.xlsx', pestTemplate)

            resolve({toxic: toxicFileLocations,pest:pestFileLocations})
        }

        if(reportType === 'pest'){
            resolve(generateFileNames(jobNumbers, '_Pesticides_report.xlsx', pestTemplate))
        }

        if(reportType === 'toxic'){
            resolve(generateFileNames(jobNumbers, '_Toxic_report.xlsx', toxicTemplate))
        }

        if(reportType === 'thc'){
            resolve(generateFileNames(jobNumbers, '_THC_report.xlsx', thcTemplate))
        }


    })

}

const copyClientInfo = async (fileLocation, clientInfo, samples, sampleData, sampleOptions) => { 

    //set either for Toxins, Pestices or Both
    for(const [key, value] of Object.entries(fileLocation)){

        //console.log(key, value)

        var wb = new Excel.Workbook(); 
        await wb.xlsx.readFile(value)
        var worksheet = wb.getWorksheet('Headers'); 
        var worksheet2 = wb.getWorksheet('SampleData')

        //general client information that is the same for all of them 
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

        //set the samples name for excel document 
        
        let sampleName = ''
        let sampleType = ''
        let counter = 1; 
        
        console.log(clientInfo[key]['sampleNames'])

        //set the given sample names and sample type
        for(let [key1,value1] of Object.entries(clientInfo[key].sampleNames)){
            sampleName += `${counter}) ${value1} `  
            sampleType = sampleOptions[key1].sampleType
            counter++; 
        }

        row = worksheet.getRow(27) 
        row.getCell(2).value = sampleName

        //this is where differences appear 

        row = worksheet.getRow(28)
        row.getCell(2).value = sampleType

        row = worksheet.getRow(29)
        switch(sampleType) {
            case 'oil':
                row.getCell(2).value = 'LOQ (Oil) '
                break;
            case 'paper':
                row.getCell(2).value = 'LOQ (Paper)'
                break;
            default:
                row.getCell(2).value = 'LOQ (Bud)'
        } 

        row.commit(); 
        wb.xlsx.writeFile(value);
        let matchingSamples = []

        for(let i = 0; i < samples.length; i++){ 
            if(samples[i].substring(0,6) === key){
                matchingSamples.push(samples[i])
            }
        }

        for(let j = 0; j < matchingSamples.length; j++){ 

            if(Object.keys(sampleData[matchingSamples[j]])){

                for(const [key2, value2] of Object.entries(sampleData[matchingSamples[j]])){
                    //console.log(parseInt(key2), parseFloat(value2))
                    
                    let locaiton = (parseInt(key2) + 1)
                    
                    let row2 =  worksheet2.getRow(locaiton)
                    
                    row2.getCell((7 + j)).value = value2
                    row2.commit()
                   
                }
            }
        }

        wb.xlsx.writeFile(value);
        

    }
}

//void function, should probably try and split it out among different things 
const copyPestData = () => {


}

const copyThcData = () => { 

}

exports.generateReports =  async (clientInfo, samples, sampleData , jobNumbers, sampleOptions, reportType) => { 
   
    console.log(clientInfo)
    console.log(samples)
    console.log(sampleData)
    console.log(jobNumbers)
    
    //create copies based on reportType (THC, PESTS and )
    const promise1 = await copyTemplate(jobNumbers, reportType).then( async (fileLocations) => {
        console.log(fileLocations)

        //must scan throught both iterations 
        if(reportType === 'both'){ 


        }else {

        //all files should normally copy this client data 
        for (const fileLocation of fileLocations){ 
            await copyClientInfo(fileLocation,clientInfo, samples, sampleData, sampleOptions)

            }
        }

        //copy the client data based on 

        //both 
        //toxic 
        //pests 
        //thc 

    })
    
    //thc 
  


}

const processPestFile = (filePath) => {
    return new Promise((resolve, reject) => {

        const wb = xlsx.readFile(path.normalize(filePath))
        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length

        data = data.slice((dataRows-1) - 112, dataRows - 1);
    
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
        
        fs.writeFileSync('test.json',JSON.stringify(data))

        resolve({jobNumbers: jobNumbers, samples: samples, sampleData: sampleData})
    }) 
}

const processThcFile = () => { 

}

exports.processExcelFile = (reportType, filePath) => {

    console.log('Processing Excel File: ', filePath) 

    if(reportType === 'pesticides'){
        return processPestFile(filePath)
    }else {
        //return processThcFile(filePath)
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
            
            if(fs.existsSync(path.resolve(newPath))){
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