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
exports.editFile = (jobNum, report) => {
    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)

    shell.openExternal('file://' + path.join(currentPath, report))
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



const thcExcelFormuals = (formulaName, letter, currentRow) => {

    switch(formulaName){

        case 'sampleName': 
            return {formula: `=IF(ISBLANK(Data!$${letter}$1),  "BLANK", Data!$${letter}$1)`, result:''}
        case 'unit':
            return {formula:`=IF(ISBLANK(Data!$${letter}$2), "", Data!${letter}$2)`, result: ''}

        case 'CBC':    
            return [
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14)`},
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14/10)`}
            ]
        
        case 'CBCA':    
            return [
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14)`},
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14/10)`}
            ]

        case 'CBD': //done 
            return [
                {formula: `=IF(Data!$${letter}$8 = 0, "ND", Data!$${letter}$8)`},
                {formula: `=IF(Data!$${letter}$8 = 0, "ND", Data!$${letter}$8/10)`}
            ]
        case "CBDA": //done 
            return [
                {formula: `=IF(Data!$${letter}$10 = 0, "ND", Data!$${letter}$10)`},
                {formula: `=IF(Data!$${letter}$10 = 0, "ND", Data!$${letter}$10/10)`}
            ]

        case 'CBNA': //done 
            return [
                {formula: `=IF(Data!$${letter}$18 = 0, "ND", Data!$${letter}$18)`},
                {formula: `=IF(Data!$${letter}$18 = 0, "ND", Data!$${letter}$18/10)`} 
            ]
        case "CBN": //done 
            return [
                {formula: `=IF(Data!$${letter}$11 = 0, "ND", Data!$${letter}$11)`},
                {formula: `=IF(Data!$${letter}$11 = 0, "ND", Data!$${letter}$11/10)`}
            ]

        case 'THCA': //done 
            return [
                {formula: `=IF(Data!$${letter}$19 = 0, "ND", Data!$${letter}$19)`, result:''},
                {formula: `=IF(Data!$${letter}$19 = 0, "ND", Data!$${letter}$19/10)`, result:''}
            ]
        
        case 'd9-THC':  //done 
            return [
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14)`, result:''},
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14/10)`, result:'' }
            ]
        case 'd8-THC':  //done 
            return [
                {formula: `=IF(Data!$${letter}$15 = 0, "ND", Data!$${letter}$15)`, result:''},
                {formula: `=IF(Data!$${letter}$15 = 0, "ND", Data!$${letter}$15/10)`, result:'' }
            ]

        
        case 'total-THC':
            return [
                {formula: `=SUM(Data!$${letter}$14, Data!$${letter}$19 * 0.877)`},
                {formula: `=SUM(Data!$${letter}$14/10, (Data!$${letter}$19/10) * 0.877)`}
            ]

        case 'total-CBD':
            return [
                {formula: `=SUM(Data!$${letter}$8, Data!$${letter}$10 * 0.877)`},
                {formula: `=SUM(Data!$${letter}$8/10, (Data!$${letter}$10/10) * 0.877)`}
            ]


        default: 
            return 'Invalid Statment'
        
    }

}

const copyFormating = (row, formulaName, dataLocation) => {

    const letter = String.fromCharCode(dataLocation + 'A'.charCodeAt(0))
    const letter2 = String.fromCharCode((dataLocation+1) + 'A'.charCodeAt(0))

    let temp = thcExcelFormuals(formulaName, letter)
    let temp2 = thcExcelFormuals(formulaName, letter2)
    row.getCell(2).value = temp[0]
    row.getCell(3).value = temp[1]
    row.getCell(4).value = temp2[0]
    row.getCell(5).value = temp2[1]
}


const pasteTables = (packageType, tableSize, runningCount, currentPage, reportType, dataLocation) => {
    
    const letter = String.fromCharCode(dataLocation + 'A'.charCodeAt(0))
    const letter2 = String.fromCharCode((dataLocation+1) + 'A'.charCodeAt(0))

    console.log('letter1: ', letter, ' letter2: ', letter2)

    if(packageType === 'Basic'){
        for(var k = 0; k < tableSize; k++){
            let row1Value = 11 + runningCount + k
            let row2Value = currentPage + runningCount + k 

            console.log('row1Value: ', row1Value, ' | row2Value: ', row2Value);

            let row = reportType.getRow(row1Value); 
            let row2 = reportType.getRow(row2Value); 
            row2.height = row.height

            row.eachCell({includeEmpty: true},(cell, colNum) => {
                row2.getCell(colNum).value = cell.value 
                row2.getCell(colNum).style = cell.style
            })

        
            if(row1Value === 11 + runningCount){
                console.log('copying Sample Names to:', row2Value) 
                let temp = thcExcelFormuals('sampleName', letter)
                let temp2 = thcExcelFormuals('sampleName', letter2)
                row2.getCell(2).value = temp
                row2.getCell(3).value = temp
                row2.getCell(4).value = temp2
                row2.getCell(5).value = temp2

            }

            if(row1Value === 13 + runningCount){
                //console.log('copying d9 THC to:', row2Value)
                copyFormating(row2, 'd9-THC', dataLocation)
            }

            if(row1Value === 14 + runningCount){
                //console.log('copying THCA to:', row2Value)
                copyFormating(row2, 'THCA', dataLocation)
            }
            if(row1Value === 15 + runningCount){
                copyFormating(row2, 'total-THC', dataLocation)
            }
            if(row1Value === 16 + runningCount){
                copyFormating(row2, 'd8-THC', dataLocation) 
            }
            if(row1Value === 17 + runningCount){
                copyFormating(row2, 'CBD', dataLocation) 
            }
            if(row1Value === 18 + runningCount){
                copyFormating(row2, 'CBDA', dataLocation) 
            }
            if(row1Value === 19 + runningCount){
                copyFormating(row2, 'total-CBD', dataLocation)  
            }
            if(row1Value === 20 + runningCount){
                copyFormating(row2, 'CBN', dataLocation)  
            }
            if(row1Value === 21 + runningCount){
                copyFormating(row2, 'CBNA', dataLocation)  
            }
            
            

        }            

        currentPage+=tableSize
                        
        if(tableSize === 12){
            reportType.mergeCells(currentPage, 2, currentPage, 3 )
            reportType.mergeCells(currentPage, 4, currentPage, 5 )
        }

        //clear the signature name  on page one 
        let row = reportType.getRow(currentPage + runningCount); 
        row.getCell(1).value = ''
        row.getCell(4).value = ''

        currentPage++;  

        console.log('Current page after table insertion: ', currentPage)
        return currentPage; 

    //Deluxe Package 
    }else {
        for(k = 0; k < tableSize; k++){
            let row1Value = 11 + runningCount + k
            let row2Value = currentPage + runningCount + k 

            console.log('row1Value: ', row1Value, ' | row2Value: ', row2Value);

            let row = reportType.getRow(row1Value); 
            let row2 = reportType.getRow(row2Value); 
            row2.height = row.height

            row.eachCell({includeEmpty: true},(cell, colNum) => {
                row2.getCell(colNum).value = cell.value 
                row2.getCell(colNum).style = cell.style
            })


        }
        currentPage+=tableSize
                        
        if(tableSize === 22){
            reportType.mergeCells(currentPage, 2, currentPage, 3 )
            reportType.mergeCells(currentPage, 4, currentPage, 5 )
        }

        //clear the signature name  on page one 
        let row = reportType.getRow(currentPage + runningCount); 
        row.getCell(1).value = ''
        row.getCell(4).value = ''

        currentPage++;  

        console.log('Current page after table insertion: ', currentPage)
        return currentPage; 


    }

}

const pastingAdditoinalInfo = (copyText, currentPage, reportType) => {
    for (var [key, value] of Object.entries(copyText)){

        let temp = currentPage++;
        let row  = reportType.getRow(temp)

        for(var l = 0; l < 7; l++){
            row.getCell(l+1).value = value[l][0] 
            row.getCell(l+1).style = value[l][1] 
            
        }
    }
}

const copyAdditonalInfo = (sheetName, reportType) => {
    let copyText = {}

    for(var j = 0; j < 12; j++ ){
        let currentRow; 
        if(reportType === 'basic'){
            currentRow = 24 + j 
        }else{
            currentRow = 34 + j 
        }
        
        //
        let row = sheetName.getRow(currentRow)
        
        let temp = []
        //needto also add the rows into play playboy 

        row.eachCell({includeEmpty: true}, (cell, colNum) => {
            temp.push([
                cell.value, cell.style
            ])                
        })

        copyText[currentRow] = temp; 
    }

    return copyText; 
}

const basicReport = (reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage) => {
    
    let test = true; 
    let tableSize; 

    if(test){
        tableSize = 12; 
    }else{
        tableSize = 11; 
    }

    let runningCount = 0;
    //starting at E
    let currentTables = 4; 

    let pageStart = [9,52, 92, 132, 172]
    let sampleStyle = reportType.getRow(9).getCell(1).style; 
    
    let totalPages = Math.floor(usedSamples/4)
    let remainder = usedSamples % 4; 
    //console.log('usedSamples: ', usedSamples)
    //console.log('total Pages: ', totalPages)
    //console.log('remainder: ', remainder)

    for(let [key2, value2] of Object.entries(reportSampleHeader)){
        console.log(`Key: ${key2}, Value: ${value2}`)

        let currentPage = pageStart[key2]

        if(tableSize === 11 && parseInt(key2) !== 0){
            currentPage++; 
        }

        console.log(currentPage); 
        console.log(runningCount)

        //if sample name takes up 2 sections, copy stypes and shift down 
        if(value2.length === 2){

            reportType.spliceRows((currentPage-1), 1, [], []);
            let row = reportType.getRow(currentPage)
            let row2 = reportType.getRow(currentPage+1); 

            row.getCell(1).value = value2[0]
            row.getCell(1).style = sampleStyle

            row2.getCell(1).value = value2[1];
            row2.getCell(1).style = sampleStyle; 

            if(parseInt(key2) === 0){
                runningCount++; 
                
            }else{
                currentPage++; 
            }

        }else{
            //normal just copies the information 

            let row = reportType.getRow(currentPage); 
            row.getCell(1).style = sampleStyle 
            row.getCell(1).value = value2[0]
        }                      
        //adds border and set height 
        if(parseInt(key2) > 0){
            //console.log('Adding border to row:', (currentPage+1))
            let temp = (currentPage+1); 
            let row3 = reportType.getRow(temp);
        
            for(let i = 1; i< 8; i++){ 
                row3.getCell(i).border = {top: {style: 'thin'}}
            }
            reportType.getRow(temp).height = 8; 
        }

        currentPage++;

        if(tableSize === 11 && parseInt(key2) === 0){
            reportType.getRow(22 + runningCount).hidden = true; 
            currentPage++; 
        }
        
        //console.log('Current Page: ', currentPage);
        //console.log("Running Count: ", runningCount)
    
        //if first page 
        if(parseInt(key2) === 0){

            //if has more then 2 items or is only page 
            if((totalPages === 0 && remainder > 2) || (totalPages === 1)){
                //top and bottom spacing 
                currentPage++; 
                currentPage += tableSize; 
                currentPage++; 
                
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables)
                currentTables+=2; 
                
                //not sure why we do this but it works lol 
                if(runningCount !== 0){
                    currentPage++; 
                }  

                //contiune page or write additonal ending information 
                if(Object.keys(reportSampleHeader).length > 1){
                    currentPage++; 
                    let row = reportType.getRow(currentPage); 
                    row.getCell(1).value = continuedNextPage; 
                    
                }else{ 
                    pastingAdditoinalInfo(copyText, currentPage, reportType)
                }
            }
            
        //anypage after the first one 
        }else {
            if(parseInt(key2) === totalPages){
                if(remainder === 0 || remainder > 2){
                    //FIXME: unsure why this fixes the problem 
                    if(runningCount === 0){
                        currentPage++; 
                    }

                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType,currentTables)
                    currentTables+=2; 
                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables)
                    currentTables+=2; 

                    if(runningCount !== 0){
                        currentPage++; 
                    } 

                }else{
                    //currentPage++; 
                    if(runningCount === 0){
                        currentPage++; 
                    }
                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables)  
                    currentTables+=2; 
                }

                pastingAdditoinalInfo(copyText, currentPage, reportType)

            }else{
                //not last page so create two tables 
                currentPage++; 
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType,currentTables)
                currentTables+=2; 
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables)
                currentTables+=2; 
                currentPage++; 

                //write contiune to next page section 
                let row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 
            }
        }
    }
}

const deluxeReport = (reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage) => {

    console.log("running deluxe report generation")

    let test = true; 
    let tableSize; 

    if(test){
        tableSize = 22; 
    }else{
        tableSize = 21; 
    }

    let runningCount = 0;

    //starting at E
    let currentTables = 2; 

    let pageStart = [9,50, 89, 128, 167, 206, 245, 284, 323, 362]
    let sampleStyle = reportType.getRow(9).getCell(1).style; 
    
    let totalPages = Math.floor(usedSamples/2)
    let remainder = usedSamples % 2; 

    console.log('usedSamples: ', usedSamples)
    console.log('total Pages: ', totalPages)
    console.log('remainder: ', remainder)

    for(let [key2, value2] of Object.entries(reportSampleHeader)){
        console.log(`Key: ${key2}, Value: ${value2}`)

        let currentPage = pageStart[key2]

        if(tableSize === 21 && parseInt(key2) !== 0){
            currentPage++; 
        }

        //console.log(currentPage); 
        //console.log(runningCount)

        //if sample name takes up 2 sections, copy stypes and shift down 
        if(value2.length === 2){

            reportType.spliceRows((currentPage-1), 1, [], []);
            let row = reportType.getRow(currentPage)
            let row2 = reportType.getRow(currentPage+1); 

            row.getCell(1).value = value2[0]
            row.getCell(1).style = sampleStyle

            row2.getCell(1).value = value2[1];
            row2.getCell(1).style = sampleStyle; 

            if(parseInt(key2) === 0){
                runningCount++; 
            }else{
                currentPage++; 
            }

        }else{
            //normal just copies the information 
            console.log('about to copy to: ', currentPage)
            let row = reportType.getRow(currentPage); 
            row.getCell(1).style = sampleStyle 
            row.getCell(1).value = value2[0]
            
        }                      
        //adds border and set height 
        if(parseInt(key2) > 0){
            //console.log('Adding border to row:', (currentPage+1))
            let temp = (currentPage+1); 
            let row3 = reportType.getRow(temp);
        
            for(let i = 1; i< 8; i++){ 
                row3.getCell(i).border = {top: {style: 'thin'}}
            }
            reportType.getRow(temp).height = 8; 
        }

        currentPage++;

        if(tableSize === 21 && parseInt(key2) === 0){
            reportType.getRow(32 + runningCount).hidden = true; 
            currentPage++; 
        }

        //paste full tables reguardless 
        //contiune or paste ending content 

        //clear the tex below and add continue to next page 
        if(parseInt(key2) === 0){

            
            if(totalPages > 0){      
                
                
                
                console.log('RUnning the clearing thing')
                currentPage = 33; 
                //clear row that is getting copied 
                let row = reportType.getRow(currentPage); 


                for(var i = 0; i < 12; i++){
                    let row2 = reportType.getRow(34 + i)
                    console.log(34 + i); 
                    row2.getCell(1).style = row.getCell(1).style; 
                    row2.getCell(1).value = ''
                    row2.getCell(4).style = row.getCell(1).style; 
                    row2.getCell(4).value = ''

                }
                currentPage++; 
                currentPage++; 
                row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 

                //pastingAdditoinalInfo(copyText, currentPage, reportType)

                


            }


        //copy table and check if end 
        }else{
            currentPage++;             
            currentPage = pasteTables('Deluxe', tableSize, runningCount, currentPage, reportType, currentTables)
            currentTables+=1; 
            
            //not sure why we do this but it works lol 
            if(runningCount !== 0){
                currentPage++; 
            }  

            //contiune page or write additonal ending information 
            //console.log(Object.keys(reportSampleHeader).length)
            if(Object.keys(reportSampleHeader).length !== totalPages + 1){
                currentPage++; 
                let row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 
                
            }else{ 
                pastingAdditoinalInfo(copyText, currentPage, reportType)
            }
        }




        
    }
        
        //console.log('Current Page: ', currentPage);
        //console.log("Running Count: ", runningCount)
    
        //if first page 
        

}
//TODO: 
//single or multi [easy]
//report type [deluxe gonna be easy]
//unit values [easy]

const generateThcReport = async(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => {

    console.log('------Copying Cannabis Data------')
    console.log(fileLocations)
    console.log(clientInfo)
    console.log(sampleNames)
    console.log(sampleData)
    console.log(sampleOptions)
    console.log("----------------------------------")

    let completedReports = []; 
    
    let continuedNextPage = {
        'richText': [
            {'font': {'bold':true, 'color':{'theme': 1}, 'size': 11, name: 'CMU Serif'}, 'text': 'Contiuned on next page...'} 
        ]
    }

    for(let [key, value] of Object.entries(sampleOptions)){
    
        //console.log(key, value)
        //console.log(fileLocations[key])
        if(!completedReports.includes(key)){
            console.log('Completed Reports:', completedReports)

            let wb = new Excel.Workbook(); 
            await wb.xlsx.readFile(fileLocations[key])

            let headersWorksheet = wb.getWorksheet('Headers')
            let dataWorksheet = wb.getWorksheet('Data')
            let reportType, copyText; 
            
            if(sampleOptions[key].reportType === 'basic'){
                reportType = wb.getWorksheet('Basic')
                copyText = copyAdditonalInfo(reportType, 'basic')
            }else{
                reportType = wb.getWorksheet('Deluxe')
                copyText = copyAdditonalInfo(reportType, 'deluxe')
            }

            await copyClientInfo(headersWorksheet, clientInfo, key.substring(0,6))
        
            let jobSamplesName = []
            let jobSamplesNumber = []
            
            //determine how many samples 
            for(var [key3, value3] of Object.entries(clientInfo[key.substring(0,6)].sampleNames)){
                if(sampleNames.includes(key3)){
                    jobSamplesNumber.push(key3)
                    jobSamplesName.push(value3)
                    completedReports.push(key3)
                }
            }

            console.log('sample names:' , jobSamplesName)
            console.log('completed Reports ',completedReports) 

            let sampleSections = 0; 
            let usedSamples = 0; 
            let reportSampleHeader = {
                0:["Samples: "]
            }

            for (var x = 0; x < jobSamplesName.length; x++){

                if(sampleOptions[key].reportType === 'basic'){
                    if((x % 4) === 0 && x !== 0){
                        sampleSections++; 
                        reportSampleHeader[sampleSections] = ["Samples: "]
                    }
                }else{
                    if((x % 2) === 0 && x !== 0){
                        sampleSections++; 
                        reportSampleHeader[sampleSections] = ["Samples: "]
                    } 
                }

                let curPos = reportSampleHeader[sampleSections].length -1 
                let testPush = reportSampleHeader[sampleSections][curPos] + ` ${usedSamples+1}) ${jobSamplesName[x]}`

                if(testPush.length > 100){
                    reportSampleHeader[sampleSections].push(`            ${usedSamples+1}) ${jobSamplesName[x]} `)
                }else{
                    reportSampleHeader[sampleSections][curPos] = reportSampleHeader[sampleSections][curPos].concat(`${usedSamples+1}) ${jobSamplesName[x].trim()} `)
                }
                
                usedSamples++; 
            }

            console.log('sample report: ', reportSampleHeader)
            
            //console.log('--------Copy Additional Info-----------')
            
            console.log('----------Data Processing--------------')
            let sampleJobData = {}
            let currentCell = 3; 
            let recoveryRow = 3; 
            
            for(var [rowNumber, recoveryVal] of Object.entries(sampleData['recovery'])){     
                let row = dataWorksheet.getRow(recoveryRow)         
                row.getCell(2).value = parseFloat(recoveryVal[1]) 
                recoveryRow++; 
                
            }

            jobSamplesNumber.forEach((job,index) => {

                let jobLocations = {}
                let jobCannaValues = {}
                let counter = 3; 

                let row = dataWorksheet.getRow(1)
                row.getCell(currentCell).value = 'Sample ' + (index + 1); 
                row = dataWorksheet.getRow(2)
                row.getCell(currentCell).value = "(mg/g)"

                for (var [rowValue, jobNum] of Object.entries(sampleData['desc'])){
                    if(job === jobNum){

                        let cannabinoidsName  = sampleData['name'][rowValue]
                        let cannabinoidsValue = sampleData['unit'][rowValue]/1000  
                        jobLocations[job] = jobNum
                        jobCannaValues[cannabinoidsName] = cannabinoidsValue
                        row = dataWorksheet.getRow(counter)
                        row.getCell(currentCell).value  = cannabinoidsValue;
                        counter++; 
                        
                    }
                }

                currentCell++; 
                sampleJobData[job] = jobCannaValues
            })         


            console.log(sampleJobData);

            console.log('----------Table Copying--------------')


          
            
            if(sampleOptions[key].reportType === 'basic'){
                basicReport(reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage);
            }else{
                deluxeReport(reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage);
            }

            await wb.xlsx.writeFile(fileLocations[key]);

        }

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
          
            await generateThcReport(fileLocations, clientInfo, sampleNames, sampleData, sampleOptions)
        }
    
    })

}
/** 
 * Processes pesticides/toxins excel File 
 * @param  {String} filepath - The file path of the pestcides excel file 
 * @return {object} An object that contains the job numbers, sample names and sample data
*/ 

//FIXME: issue when there is more then 1 page worth of content 122 for example 
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
            let stdconc = ws.getColumn('AL')
            
            
            //let mg = ws.getColumn(); 
            //let concentration = ws.getColumn()
            
            descCol.eachCell(function(cell, rowNumber) {
                //console.log(rowNumber, cell.text)
               
                if(cell.text.match(/(\d+)-[0-9]$/)){    
                    desc[rowNumber] = cell.text
                    name[rowNumber] = nameCol.values[rowNumber]


                    unit[rowNumber] = unitCol.values[rowNumber]

                    if(unit[rowNumber] === undefined){
                        unit[rowNumber] = 0; 
                    }
                  
                    //recovery[rowNumber] = recoveryCol.values[rowNumber]

                    if(!sampleNames.includes(cell.text)){
                        sampleNames.push(cell.text)
                        
                    }
                }
            });

            stdconc.eachCell(function(cell, rowNumber){
                //console.log(rowNumber, cell.text)
                if(parseInt(cell.text) === 10){
                    //console.log(rowNumber)
                    recovery[rowNumber] = [nameCol.values[rowNumber],recoveryCol.values[rowNumber]]
                    
                }
            })
        
            //console.log(recovery)
            sampleNames.forEach((sample, i) => {
                let jobNum = sample.substring(0,6)

                if(!jobNums.includes(jobNum)){
                    jobNums.push(jobNum)
                }
            })

            

            //console.log('Testing', desc.values[1])
            resolve({jobNumbers: jobNums, samples: sampleNames, recovery:recovery, sampleData: {desc:desc,name:name, unit:unit, recovery:recovery}})
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
