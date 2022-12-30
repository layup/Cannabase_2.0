const {shell } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const path = require('path')
const xlsx = require('xlsx')
const Excel = require('exceljs');
var readline = require('readline');


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
    const regex = /.*.pdf/

    return new Promise((resolve, reject) => {

        let scanned_files = [] 

        if(fs.existsSync(currentPath)){
            fs.readdir(currentPath, (err, files) => {
                files.forEach(file => {
                
                    if(scanned_files.includes(file) === false){
                        if(regex.test(file)){
                            scanned_files.push(file)
                            resolve(scanned_files)
                        } 
                    }
       
                });
            });
        }
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

//edit the excel files from the thing
//scan for .xlsx files 
exports.editFile = (jobNum) => {

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
        pest: 'particles_template.xlsx', 
        toxic: 'toxins_template.xlsx'
    }

    let pestTemplate = path.join(templatesPath, templateNames['pest']) 
    let toxicTemplate = path.join(templatesPath, templateNames['toxic']) 
    let thcTemplate = path.join(templatesPath, templateNames['thc']) 

    if(reportType === 'both'){
        let toxicFileLocations = await generateFileNames(jobNumberSample, '_Toxic_report.xlsx', toxicTemplate, option) 
        let pestFileLocations =  await generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate, option )

        return ( ({[jobNumberSample]: [toxicFileLocations, pestFileLocations]}))
            
    }

    if(reportType === 'pest'){
        
        return (generateFileNames(jobNumberSample, '_Pesticides_report.xlsx', pestTemplate, option))
    }

    if(reportType === 'toxic'){
            return ((generateFileNames(jobNumberSample, '_Toxic_report.xlsx', toxicTemplate, option)))
    }

    if(reportType === 'basic' || reportType === 'deluxe'){
        return( (generateFileNames(jobNumberSample, '_THC_report.xlsx', thcTemplate, option)))
    }


}

const tablePlacementCalculator = () => { 

}


/**
 * Copy the basic client information into the excel header sheet 
 * @param {Object} worksheet - the excel sheet (header) that client information will be copied too  
 * @param {Object} clientInfo - the job numbers client information  
 * @param {String} key - the job numver 
 */

const copyClientInfo = async (worksheet, clientInfo, key) => {

    //console.log('Copying Client Information: ', key)
    //console.log(clientInfo[key] )

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

    await row.commit(); 
}




const singleCopyPestData = async (headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, sampleName, options) => {

    //console.log('Coping Pestcides/Toxic Data')

    let headerRow, dataRow; 
    
    headerRow = headersWorksheet.getRow(27) 
    headerRow.getCell(2).value = `1) ${clientInfo[sampleName.substring(0,6)]['sampleNames'][sampleName]}`

    headerRow = headersWorksheet.getRow(28)
    headerRow.getCell(2).value = options.sampleType 

    headerRow = headersWorksheet.getRow(30)

    switch(options.sampleType) {
        case 'oil':
            headerRow.getCell(2).value = 'oil'
            break;
        case 'paper':
            headerRow.getCell(2).value = 'paper'
            break;
        default:
            headerRow.getCell(2).value = 'bud'
    } 

   //if object empty with not initiate 
    for(const [key, value] of Object.entries(sampleData[sampleName])){
        let location = (parseInt(key) + 1)

        dataRow = dataWorksheet.getRow(location)
        dataRow.getCell(7).value = parseInt(value)

        await dataRow.commit()

    }

    return sampleName

}

//account for more then two, if more then that we can copy and paste into given file type 
const multiCopyPestData = async(headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, sampleName, options) => {

    //console.log('Coping Pestcides/Toxic Data')
    let headerSampleName = ''; 
    let headerRow, dataRow;
    let processed = [] 
    let counter = 1; 

    for(let [key, value ] of Object.entries(clientInfo[sampleName.substring(0,6)]['sampleNames'])){
        if(sampleOptions[key].amount === 'mult'){
            processed.push(key)
            headerSampleName += `${counter}) ${value}`  
            counter++; 
        }
    }
    
    headerRow = headersWorksheet.getRow(27) 
    headerRow.getCell(2).value = headerSampleName

    headerRow = headersWorksheet.getRow(28)
    headerRow.getCell(2).value = options.sampleType 

    headerRow = headersWorksheet.getRow(30)

    switch(options.sampleType) {
        case 'oil':
            headerRow.getCell(2).value = 'oil'
            break;
        case 'paper':
            headerRow.getCell(2).value = 'paper'
            break;
        default:
            headerRow.getCell(2).value = 'bud'
    } 

    if(processed.length === 2){
        dataRow = dataWorksheet.getRow(1)
        dataRow.getCell(8).value = 'Sample 2'
    }
    //console.log('Matching Samples:', processed)

    for(let j = 0; j < processed.length; j++){ 

        if(Object.keys(sampleData[processed[j]])){
            
            for(const [key2, value2] of Object.entries(sampleData[processed[j]])){
                let locaiton = (parseInt(key2) + 1)
                
                dataRow =  dataWorksheet.getRow(locaiton)
                
                dataRow.getCell((7 + j)).value = parseInt(value2)
                dataRow.commit()
               
            }
        }

    }



    //console.log('Processed: ', processed )
    //this is where we can decide to create a recursive function that does match to calculate the correct amount for the thing 

    return processed

}



//void function, should probably try and split it out among different things 
const copyPestInfo = async (fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => { 

    console.log('Copying Pesticides Data')

    let completedReports = [] 

    for(let [key, value] of Object.entries(sampleOptions)){
        //console.log(key,value)
        //console.log('completed Reports:' , completedReports)
        //if hasn't looped yet 
        if(!completedReports.includes(key)){

            key = String(key)
            //if single of multi 
            if(value['amount'] === 'single'){
                completedReports.push(key)

                //if both isntead of toxic or pest 
                if(value['toxins'] === 'both'){

                    //loop throught the pest and toxins 
                    for(let i = 0; i < fileLocations[key].length; i++){
                        const  currentPath = fileLocations[key][i][key] 

                        let wb = new Excel.Workbook(); 
                        await wb.xlsx.readFile(currentPath)

                        let headersWorksheet = wb.getWorksheet('Headers'); 
                        let dataWorksheet = wb.getWorksheet('Data')

                        await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))
                        await singleCopyPestData(headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                        await wb.xlsx.writeFile(currentPath);

                    } 

                }else{

                    let wb = new Excel.Workbook(); 
                    await wb.xlsx.readFile(fileLocations[key])

                    let headersWorksheet = wb.getWorksheet('Headers'); 
                    let dataWorksheet = wb.getWorksheet('Data')

                    await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))
                    await singleCopyPestData(headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                    await wb.xlsx.writeFile(fileLocations[key]);

                }

            }else{ 
                //while this can push multiple keys onto the complete reports page 
                if(value['toxins'] === 'both'){

                    for(let i = 0; i < fileLocations[key].length; i++){
                        const  currentPath = fileLocations[key][i][key] 

                        let wb = new Excel.Workbook(); 
                        await wb.xlsx.readFile(currentPath)

                        let headersWorksheet = wb.getWorksheet('Headers'); 
                        let dataWorksheet = wb.getWorksheet('Data')

                        await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))

                        let completed = await multiCopyPestData(headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                        completedReports = completedReports.concat(completed) 

                        await wb.xlsx.writeFile(currentPath);
                    }

                }else {
                    
                    let wb = new Excel.Workbook(); 
                    await wb.xlsx.readFile(fileLocations[key])

                    let headersWorksheet = wb.getWorksheet('Headers'); 
                    let dataWorksheet = wb.getWorksheet('Data')

                    await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))

                    let completed = await multiCopyPestData(headersWorksheet, dataWorksheet, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                    completedReports = completedReports.concat(completed) 

                    await wb.xlsx.writeFile(fileLocations[key]);
                }


            }
        }

    }

}


const recursiveTableCopy = async () => {

}


//single or multi 
//report type 
//unit values 
const copyTHCInfo = async(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => {

    console.log('------Copying Cannabis Data------')
    console.log(fileLocations)
    console.log(clientInfo)
    console.log(sampleNames)
    console.log(sampleData)
    console.log(sampleOptions)
    console.log("----------------------------------")

    let completedReports = []; 


    for(let [key, value] of Object.entries(sampleOptions)){
    
        //console.log(key, value)
        //console.log(fileLocations[key])

        let wb = new Excel.Workbook(); 
        await wb.xlsx.readFile(fileLocations[key])

        let headersWorksheet = wb.getWorksheet('Headers')
        let reportType; 

        if(sampleOptions[key].reportType === 'basic'){
            reportType = wb.getWorksheet('Basic')
        }else{
            reportType = wb.getWorksheet('Deluxe')
        }

        await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))
       
        //get the row 
    
        let currrentRow = 0 
        let totalSamples; 
        let jobSamples = []
        
        let totalTables = 1; 

        let continuedNextPage = {
            text: 'Contiuned on next page...', 
            style: {
                font: {size: 10, name: 'CMU Serif Roman'},
                alignment: {vertical: "middle"}
            }
        }
        
        //determine how many samples 
        try {
            totalSamples = parseInt(clientInfo[key.substring(0,6)].numSamples)
            console.log('Total Samples: ', totalSamples)

            for(var [key3, value3] of Object.entries(clientInfo[key.substring(0,6)].sampleNames)){
                jobSamples.push(value3) 
            }

        } catch (error){
            console.log(error)
        }

        console.log('sample names:' , jobSamples)
        //24, 25, 27, 28, 30, 31 
        
        //TODO: copy sample names, but also have to consider the multiple sheets that can get generated 
        //if 4 then good totalTables % 4 = remainder, based on tables 
        
        let sampleSections = 0; 
        let usedSamples = 0; 
        let reportSampleHeader = {
            0:["Samples: "]
        }

        //reportSampleHeader[0][0] = reportSampleHeader[0][0].concat("Hello World")
        
    
        for(var x = 0; x < jobSamples.length; x++){
            //console.log('sample Section: ', x, sampleSections)
            if((x % 4) === 0 && x !== 0 ){
                sampleSections++; 
                reportSampleHeader[sampleSections] = ["Samples: "]
                console.log('increaing on x: ', x)
            }
            
            let curPos = reportSampleHeader[sampleSections].length -1 

            let testPush = reportSampleHeader[sampleSections][curPos] + ` ${usedSamples+1}) ${jobSamples[x]}`
            //console.log(testPush)

            if(testPush.length > 110){
                reportSampleHeader[sampleSections].push(`            ${usedSamples+1}) ${jobSamples[x]} `)

                
            }else{
                reportSampleHeader[sampleSections][curPos] = reportSampleHeader[sampleSections][curPos].concat(`${usedSamples+1}) ${jobSamples[x]} `)
            }
            
            usedSamples++; 
            
        }
        console.log('sample report: ', reportSampleHeader)
        

        let copyText = {}

        for(var j = 0; j < 12; j++ ){
            let currentRow2 = 24 + j
            let row = reportType.getRow(currentRow2)
            
            let temp = []
            //needto also add the rows into play playboy 

            row.eachCell({includeEmpty: true}, (cell, colNum) => {
                temp.push([
                    cell.value, cell.style
                ])                
            })

            copyText[currentRow2] = temp; 
        }

        //console.log(copyText)

        //console.log(copyText);

        //insert sample names 
        //console.log('sampleSection: ', sampleSections)
        if(sampleSections === 0 && key === '171087-1'){
            //console.log('running test')

            //console.log(row.getCell(1).value)
            if(reportSampleHeader[0].length === 2){
                //reportType.spliceColumns(8,1,reportSampleHeader[0][0], reportSampleHeader[0][1])
                reportType.spliceRows(8, 1, [], [reportSampleHeader[0][0]]);
                let row = reportType.getRow(10); 
                let row2 = reportType.getRow(9); 
                
                row.getCell(1).value = reportSampleHeader[0][1] 
                row2.getCell(1).style = row.getCell(1).style

                console.log(row2.getCell(1))
                
                //const rowValues = []; 
                //rowValues[1] = reportSampleHeader[0][1] 
                //reportType.addRow(rowValues)
            }else {
                let row = reportType.getRow(9); 
                row.getCell(1).value = reportSampleHeader[0][0] 
            }

        }






        //name section can contain 110 words but certain words can be a longer 
        //let row2 = reportType.getRow(39); 

        
        /*
        for(var i = 0; i < 11; i++){

            let row1Value = 11 + i
            let row2Value = 24 + i 
            currrentRow = row2Value;
            
            let row = reportType.getRow(row1Value); 
            let row2 = reportType.getRow(row2Value); 
            row2.height = row.height

            row.eachCell({includeEmpty: true},(cell, colNum) => {
                row2.getCell(colNum).value = cell.value 
                row2.getCell(colNum).style = cell.style
                
            })
        }

        
        currrentRow++; 


        currrentRow++; 
        for (var [key2, value2] of Object.entries(copyText)){

            
            let temp = currrentRow++ 
            let row3 = reportType.getRow(temp)
            //console.log('current Row', temp)
            for(var k = 0; k < 7; k++){
 
           
                row3.getCell(k+1).value = value2[k][0] 
                row3.getCell(k+1).style = value2[k][1] 
                
            }



        }
        */ 

        //console.log(reportType.actualRowCount)
        //console.log(reportType.rowCount)
        //console.log(reportType.cellCount)

        //console.log(row)
        //reportType.insertRow(39, row)

        await wb.xlsx.writeFile(fileLocations[key]);



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

        for(let key in sampleOptions){
            if(sampleOptions.hasOwnProperty(key)){
                let tempObject =  await copyTemplate(key, sampleOptions[key]['reportType'], sampleOptions[key].amount)
                fileLocations[key] = tempObject[key]
                
            }
        }

        if(reportType === 'pesticides'){
            await copyPestInfo(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
            
        }

        if(reportType === 'cannabis'){
            await copyTHCInfo(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
        }
    
    })

}
/** 
 * Processes pesticides/toxins excel File 
 * @param  {String} filepath - The file path of the pestcides excel file 
 * @return {object} An object that contains the job numbers, sample names and sample data
*/ 
const processPestFile = (filePath) => {
    return new Promise((resolve, reject) => {

        const wb = xlsx.readFile(path.normalize(filePath))
        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length 

        //check the length of the DataRows 
        //we keep on creating dataRows based on how large the size is 

        //1 page worth = 122 and maybe do it in a recursive way, could switch up and use EXCELJS processing, 
        //might be better sinces it's a column by column approach 
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


/** 
 * Processes Cannabis excel File 
 * @param  {String} filepath - The file path of the THC excel file 
 * @return {object} An object that contains the job numbers, sample names and sample data
*/ 

const processThcFile = (filePath) => { 

    console.log("Procesing THC file ")

    return new Promise((resolve, reject) => {

        let workbook = new Excel.Workbook();

        let sampleNames = []
        let jobNums = []

        let desc = {}
        let name = {}
        let unit = {}
        let recovery ={}
        

        workbook.xlsx.readFile(path.normalize(filePath)).then(function() {
            let ws = workbook.getWorksheet("Sheet1")
            //console.log(ws)
            let descCol = ws.getColumn('BG'); 
            let nameCol = ws.getColumn('BK'); //THC name 
            let unitCol = ws.getColumn('BX')
            let recoveryCol = ws.getColumn('EH')
            
            //let mg = ws.getColumn(); 
            //let concentration = ws.getColumn()
            
            descCol.eachCell(function(cell, rowNumber) {
                //console.log(rowNumber, cell.text)
               
                if(cell.text.match(/(\d+)-[0-9]$/)){    
                    desc[rowNumber] = cell.text
                    name[rowNumber] = nameCol.values[rowNumber]
                    unit[rowNumber] = unitCol.values[rowNumber]
                    recovery[rowNumber] = recoveryCol.values[rowNumber]

                    if(!sampleNames.includes(cell.text)){
                        sampleNames.push(cell.text)
                        
                    }
                }
            });

            sampleNames.forEach((sample, i) => {
                let jobNum = sample.substring(0,6)

                if(!jobNums.includes(jobNum)){
                    jobNums.push(jobNum)
                }
            })

            

            //console.log('Testing', desc.values[1])
            resolve({jobNumbers: jobNums, samples: sampleNames, sampleData: {desc:desc,name:name, unit:unit}})
        });
    
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

    
    const txtPath = path.normalize(store.get('txtPath'))
    
    let txtNames = []
    let regex = /TXT-.*/

    //scan the dir 
    const dirResults = await fs2.readdir(txtPath)

    //console.log(jobNumbers)
    //console.log(dirResults)
    

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

    if(jobNumbers.length > 1){
         difference = jobNumbers.filter(x => !selectedNumbers.includes(x));
    }

    //console.log('difference: ', difference)
    //console.log(clientPath)

    let clientInfo = {}
    
    for(var clientKey in clientPath){
        clientInfo[clientKey] = await GenerateClientData(clientKey, clientPath[clientKey])

    }
    

    if(difference.length > 0){
        //generate empty data 

        console.log('difference: ', difference)

        let emptySampleNames = {}
        

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
        //console.log(`${line.length}: ${line}` )
        if(line.length > 0 ) {
            
            if(counter === 0){
                clientName = line.match(/(\s{5})(.*?)(\s{5})/)[0].trim()
                date = line.match(/[0-9]{2}[a-zA-Z]{3}[0-9]{2}/)[0]
                //time = line.match(/[0-9]{2}:[0-9]{2}[ap]/)[0]
                time = line.substring(65,73).trim()
                
            }
            if(counter === 1){
                attention = line.match(/\*(.*?)(?=\s{3})/)
                //console.log('att', attention)

                const headerSplit = line.split("   ").filter(String)
                //console.log(headerSplit)
                
                if(line.length > 25 && headerSplit.length === 2){
                     //sampleType1 = (line.substring(line.length/2,line.length)).match(/\w+/)[0];
                     sampleType1 = headerSplit[1].trim()
                }

               
                
                if(attention){
                    attention = attention[0] 
                    
                }else {
                    try {
                        addy1 = headerSplit[0].trim()
                        /*
                        if(line.length > 30){
                            //addy1 = (line.substring(0, line.length/2)).match(/\w+(\s\w+){2,}/)[0];
                            addy1 = headerSplit[0].trim(); 
                        }else {
                            //addy1 = (line.substring(0, line.length)).match(/\w+(\s\w+){2,}/)[0];
                            addy1 = headerSplit[0].trim(); 
                        }*/ 
                        
                       
                        //addy1 = (line.substring(0, line.length/2)).match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\-#\.\/]+$/);
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
                if(attention){
                   addy3 = line.replace(/\s/g, '');
                }else {
                    telephone = line.substring(20,50).replace('TEL:', '').trim() 
                    try {
                        recvTemp = line.match(/((\d+).[\d]C)/)[0]
                    }catch (err){
                        console.log(err)
                    }
                    
                }
            }

            if(counter === 5 ){
                if(attention){
                    telephone = line.substring(20,50).replace('TEL:', '').trim()
                    try {
                        recvTemp = line.match(/((\d+).[\d]C)/)[0]
                    }catch (err){
                        console.log(err)
                    } 
                 }else{
                    fax = line.replace('FAX:', '').trim();
                 }
            }

            if(counter === 6){ 
                
                if(attention){
                    fax = line.replace('FAX:', '').trim(); 
                }else {
                    //email = line.substring(20,50).trim()
                    try {
                         email = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)[0]
                    } catch (err){
                        console.log(err)
                    }
                    
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        try {
                            paymentInfo = paymentInfo[0]
                        } catch (err) {
                            console.log(err)
                        }
                        
                    }
                }
            
            }
            if(counter === 7){
                if(attention){
                    //email = line.substring(20,50).trim()
                    try{
                        email = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)[0]
                    } catch (err) {
                        console.log(err)
                    }
                    
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        try {
                             paymentInfo = paymentInfo[0]
                        } catch (err){
                            console.log(err)
                        }
                       
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