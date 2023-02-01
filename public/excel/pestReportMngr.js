const Excel = require('exceljs');
const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')
/**
 * Copy the basic client information into the excel header sheet 
 * @param {Object} worksheet - the excel sheet (header) that client information will be copied too  
 * @param {Object} clientInfo - the job numbers client information  
 * @param {String} key - the job numver 
 */

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
    await row.commit(); 
}

/** 
 * Processes pesticides/toxins excel File 
 * @param  {String} filepath - The file path of the pestcides excel file 
 * @return {object} An object that contains the job numbers, sample names and sample data
*/ 

//FIXME: issue when there is more then 1 page worth of content 122 for example 
const processPestFile = (filePath) => {
    return new Promise((resolve, reject) => {

        console.log("Processing Pest/Toxins File")
        const wb = xlsx.readFile(path.normalize(filePath))
        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length 

        //console.log(dataRows) //235 
        //console.log(data)

        //1 page worth = 122 and maybe do it in a recursive way, could switch up and use EXCELJS processing,
        //[9-]
        //skip the first 9 [0-8] only for page 1
        //each consists of 112 rows  

        let totalSections = parseInt(dataRows/(104 + 3 + 3)) 
        let dataSections = []
        let budHeader = []
        let budNames = []
        let budLocations = []
        let samples =[]
        let samples2 =[]
        let jobNumbers = []
        let jobNumberSection = []
        let sampleData = {}

        if(totalSections > 1){
            for(var i = 0; i < totalSections; i++){

                let tempData = data; 

                if(i !== 0){
                    let sliceStart = ((112 * i) + 10); 
                    let sliceEnd = sliceStart + 112; 
                    tempData = tempData.slice(sliceStart,sliceEnd)
                }else {
                    tempData = tempData.slice(9, (dataRows-1)-112)
                }

                dataSections.push(tempData)
                budHeader.push(tempData[2])
                budNames.push(tempData[1])
            }

        }else {
            data = data.slice(9, dataRows-1)
            //console.log('data1')
            //console.log(data) 
            dataSections.push(data)
            budHeader.push(data[2])
            budNames.push(data[1])
        }

        //fs.writeFileSync('test.json',JSON.stringify(data))
        //data = data.slice(0, dataRows-1)
    
        for(let i = 0; i < budHeader.length; i++){
            let tempLocations = []

            for (var key in budHeader[i]) {
                if(budHeader[i][key] === 'ng/g'){
                    tempLocations.push(key)
                }
            }
            budLocations.push(tempLocations)

        }

        for(let i = 0; i < budLocations.length; i++){

            let tempJob = []
            let tempJobNum = []

            for(var key2 in budLocations[i]){
                tempJob.push(budNames[i][budLocations[i][key2]])
                let sampleNum = budNames[i][budLocations[i][key2]]

                let jobNumber = budNames[i][budLocations[i][key2]].substring(0,6)
    
                if(!jobNumbers.includes(jobNumber)){
                    jobNumbers.push(jobNumber)
                    
                }

                if(!tempJobNum.includes(jobNumber)){
                    tempJobNum.push(jobNumber)
                }


                if(!samples2.includes(sampleNum)){
                    samples2.push(sampleNum)
                }

            }

            samples.push(tempJob)
            jobNumberSection.push(tempJobNum)


        }
        console.log("Phase 2")
        console.log(budLocations)
        console.log(samples)
        console.log(samples2)
        console.log(jobNumbers)
        console.log(jobNumberSection)

        for(i = 0; i < budHeader.length; i++ ){
            for (let j = 0; j < budLocations[i].length; j++){        
                let tempData  = {}
    
                dataSections[i].forEach((item) => {
                   
                    if((typeof(item[budLocations[i][j]]) !== "undefined") && (typeof(item.__EMPTY_1) !== 'undefined')){
                        //console.log(item[budLocations2[i][j]])
                        tempData[item.__EMPTY_1] = item[budLocations[i][j]]
                    }
                })

                //console.log(tempData)
                let objName = budNames[i][budLocations[i][j]]
                //console.log(objName)
                sampleData[objName] = tempData

            }
        }
        
        console.log('done')
        console.log(sampleData)
        console.log(jobNumbers)
        console.log(samples)

        //fs.writeFileSync('test.json',JSON.stringify(data))

        resolve({jobNumbers: jobNumbers, samples: samples2, sampleData: sampleData})
        
        
    }) 
}


const copyFooter = (sheetName, reportType ) => {
    let copyText = {}
    let currentRow 

    if(reportType === 'toxins'){
  
        for(let i = 0; i < 23; i++){

            currentRow = 20 + i; 
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

    }else{
        for(let i = 0; i < 14; i++){

            currentRow = 128 + i; 
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
        
    } 

    return copyText; 
}

const pasteFooter = (sheetName, copyText, currentRow) => {

    for(let [key, value] of Object.entries(copyText)){

        //currentRow++ 

        let row = sheetName.getRow(currentRow)

        for(var l = 0; l < value.length; l++){
            row.getCell(l+1).value = value[l][0] 
            row.getCell(l+1).style = value[l][1] 
        }

        currentRow++; 
    }
}


const pasteName = (sheetName, postion, samplePostion, totalSamples, samples, samplesName) => {



    let row = sheetName.getRow(postion)
    //row.getCell(1).value = 

}




//max total of 3 tables (6 samples a page)
//include sample names with each section of the toxin reports 

const processToxins = (reportSheet, samples, sampleNames, copyText) => {

    let continuedNextPage = {
        'richText': [
            {'font': {'bold':true, 'color':{'theme': 1}, 'size': 11, name: 'CMU Serif'}, 'text': 'Contiuned on next page...'} 
        ]
    }

    let tableSize = 8 
    let pageStarts = [50,91,130]
    //let totalSamples = samples.length 
    let totalSamples =samples.length; 

    console.log("----- PROCESSING TOXINS ------")
    console.log('samples: ', samples)
    console.log('total samples: ', totalSamples)
    console.log("sample names: ", sampleNames)
    console.log("------------------------------")


    //would have 8 if statements or if I can come up with a recursive method 
    //longterm for up to an unlimtaed amount of things but am feeling kinda lazy 
    if(totalSamples === 2){
        return; 
    }

    //clear the page so it becomes empty for tables insertions 
    for(let i = 0; i < 23; i++){
        console.log('i: ', i)
        let row = reportSheet.getRow(20 +i ); 
        let blankRow = reportSheet.getRow(45).getCell(1)

        for(let j = 1; j < 8; j++ ){
            row.getCell(j).style = blankRow.style
            row.getCell(j).value = blankRow.value
        }
    }

    let currentPostion = 20 
        
    if(totalSamples === (3 || 4)){
        let counter = 2; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 
        
        //insert sample names 
        currentPostion = pasteName(reportSheet, pageStarts[0], counter, totalSamples, samples, sampleNames)

        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 8) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion)
        
    }

    if(totalSamples === (5 || 6)){


        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 8) 
        currentPostion++; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        
        //insert sample names 
        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 10) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion)
    }

    if(totalSamples === (7 || 8) ){

        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 8) 
        currentPostion++; 

        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 10) 
        currentPostion++; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        
        //insert sample names 
        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 12) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion)
    }

    if(totalSamples === (9 || 10)){
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 8) 
        currentPostion++; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 10) 
        currentPostion++; 
        
        //insert sample names 
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 12) 
        currentPostion++; 
       
        row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[1], 0, 14) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion)
    }

    if(totalSamples === (11 || 12)){
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 8) 
        currentPostion++; 

        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 10) 
        currentPostion++; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 12) 
        currentPostion++; 
        
        //insert sample names 
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 14) 
        currentPostion++; 
       
        row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[1], 0, 16) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion)
    }

    if(totalSamples === (13 || 14) ){
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 8) 
        currentPostion++; 

        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 10) 
        currentPostion++; 

        //continue to the next page         
        let row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[0], 0, 12) 
        currentPostion++; 
        
        //insert sample names 
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 14) 
        currentPostion++; 
        
        currentPostion = pasteToxinTable(reportSheet, currentPostion, 0, 16) 
        currentPostion++; 
       
        row = reportSheet.getRow(currentPostion); 
        row.getCell(1).value = continuedNextPage; 

        currentPostion = pasteToxinTable(reportSheet, pageStarts[1], 0, 18) 
        currentPostion++; 

        pasteFooter(reportSheet, copyText, currentPostion) 
    }
    



}

const processPesticdes = () => {

    let continuedNextPage = {
        'richText': [
            {'font': {'bold':true, 'color':{'theme': 1}, 'size': 11, name: 'CMU Serif'}, 'text': 'Contiuned on next page...'} 
        ]
    }



}


const toxinsExcelFormulas = (formalName, letter) => {
    switch(formalName){

        case 'sampleName': 
            return {formula: `=IF(ISBLANK(Data!$${letter}$1),"EMPTY ",Data!$${letter}$1)`}
        case 'unitValue': 
            return {formula: `=IF(ISBLANK(Data!$${letter}$1),"","(ng/g)")`} 
        case 'B1': 
            return {formula: `=IF(Data!$${letter}99, Data!$${letter}99, "ND")`}
        case 'B2': 
            return {formula: `=IF(Data!$${letter}100, Data!$${letter}100, "ND")`}
        case 'G1': 
            return {formula: `=IF(Data!$${letter}101, Data!$${letter}101, "ND")`}
        case 'G2':
            return {formula: `=IF(Data!$${letter}102, Data!$${letter}102, "ND")`} 
        case 'A': 
            return {formula: `=IF(Data!$${letter}103, Data!$${letter}103, "ND")`}
        case 'Z': 
            return {formula: `=IF(Data!$${letter}104, Data!$${letter}104, "ND")`}

        default:
            return "invalid Statement"
    }
}

 const copyFormating = (row, formulaName, letter, letter2) => {
    let temp = toxinsExcelFormulas(formulaName, letter)
    let temp2 = toxinsExcelFormulas(formulaName, letter2)
    
    row.getCell(3).value = temp
    row.getCell(4).value = temp2 
}

const pasteToxinTable = (sheet, startingLocation, runningCount,  dataLocation) => {

    const letter = String.fromCharCode(dataLocation + 'A'.charCodeAt(0))
    const letter2 = String.fromCharCode((dataLocation+1) + 'A'.charCodeAt(0))

    console.log("Letter1: ", letter, " ", "Letter2: ", letter2)

    let tableSize = 8; 
    
    for(let i = 0; i < tableSize; i++){
        let row1Value = 11 + runningCount + i 
        let row2Value = startingLocation + runningCount + i 

        let row = sheet.getRow(row1Value); 
        let row2 = sheet.getRow(row2Value); 

        row.eachCell({includeEmpty: true},(cell, colNum) => {
            row2.getCell(colNum).value = cell.value 
            row2.getCell(colNum).style = cell.style
        })

        if(row1Value === 11 + runningCount){
            copyFormating(row2, 'sampleName', letter, letter2)
        }
        if(row1Value === 12 + runningCount){
            copyFormating(row2, 'unitValue', letter, letter2) 
        } 
        if(row1Value === 13 + runningCount){
            copyFormating(row2, 'B1', letter, letter2) 
        } 
        if(row1Value === 14 + runningCount){
            copyFormating(row2, 'B2', letter, letter2)  
        } 
        if(row1Value === 15 + runningCount){
            copyFormating(row2, 'G1', letter, letter2) 
        } 
        if(row1Value === 16 + runningCount){
            copyFormating(row2, 'B2', letter, letter2) 
        } 
        if(row1Value === 17 + runningCount){
            copyFormating(row2, 'A', letter, letter2) 
        } 
        if(row1Value === 18 + runningCount){
            copyFormating(row2, 'Z', letter, letter2) 
        } 
    }

    return startingLocation + tableSize
    
}


const singleCopyPestData = async (workbook, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, sampleName, options) => {

    //console.log('Coping Pestcides/Toxic Data')

    let headersWorksheet = workbook.getWorksheet('Headers'); 
    let dataWorksheet = workbook.getWorksheet('Data')
    let report = workbook.getWorksheet(1)

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
const multiCopyPestData = async(workbook, fileLocations, clientInfo, sampleNumbers, sampleOptions, sampleData, sampleName, options) => {

    console.log('-----Multi Pest/Toxins Copy-----')
    console.log(sampleName)
    //console.log(sampleData)
    //console.log(fileLocations)
    console.log(sampleNumbers)
    console.log(sampleOptions)
    //console.log(options)
    console.log(clientInfo)
    console.log('--------------------------------')

    let reportType = options['reportType']
    let headerSampleName = ''; 
    let headerRow, dataRow;
    let processed = [] 
    let sampleNames = {}
    let counter = 1; 

    let headersWorksheet = workbook.getWorksheet('Headers'); 
    let dataWorksheet = workbook.getWorksheet('Data')
    let reportSheet = workbook.getWorksheet(1)

    //setting sample name
    for(let [key, value] of Object.entries(clientInfo[sampleName.substring(0,6)]['sampleNames'])){
        try{
            if(sampleOptions[key.toString()].amount === 'mult'){
                processed.push(key)
                sampleNames[key] = {key: value} 
                headerSampleName += `${counter}) ${value}`  
                counter++; 
            } 
        } catch (error){
            console.log('Error with ', key)
            console.log(error)
        }
    }
    
    console.log('Sample Name: ', sampleNames)
    console.log('Processed : ', processed)
    //console.log(processed)
    
    //sample Name 
    headerRow = headersWorksheet.getRow(27) 
    headerRow.getCell(2).value = headerSampleName

    //SampleType 
    headerRow = headersWorksheet.getRow(28)
    headerRow.getCell(2).value = options.sampleType 
    
    //LOQ Tyupe 
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

    //setting up sample name, will need to redo 
    if(processed.length > 1){
        dataRow = dataWorksheet.getRow(1)
        for(let i = 1; i < processed.length; i++){
            dataRow.getCell(7 + i).value = `Sample ${1+i}`
        }
    }


    //copying data 
    for(let j = 0; j < processed.length; j++){ 
        if(Object.keys(sampleData[processed[j]])){
            for(const [key2, value2] of Object.entries(sampleData[processed[j]])){
                let locaiton = (parseInt(key2) + 1)
                
                dataRow =  dataWorksheet.getRow(locaiton)
                dataRow.getCell((7 + j)).value = parseInt(value2)

            }
        }
    }

    console.log('Copying Footer')
    let copyText = copyFooter(reportSheet, reportType)
    //pasteFooter(reportSheet, copyText, 149)


    //determine for the multiples which ones would go 
    //check which ones are multi vs single 

    
    //determine job


    


    if(reportType === 'both'){

    }

    if(reportType === 'pest'){

    }

    if(reportType === 'toxins'){
        processToxins(reportSheet, processed, sampleNames, copyText) 
    }


    
    return processed

}


//void function, should probably try and split it out among different things 
const genereatePestReport = async (fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => { 

    console.log('Copying Pesticides Data')
    console.log(sampleOptions)
    console.log(clientInfo)
    console.log(fileLocations)
    console.log(sampleNames)
    console.log(sampleData)
    console.log('----------------------')
    let completedReports = [] 

    for(let [key, value] of Object.entries(sampleOptions)){
        //console.log('Phase 1')
        //console.log(key,value)
        console.log('completed Reports:' , completedReports)

        if(!completedReports.includes(key)){

            key = String(key)
            let jobNumber = key.substring(0,6)

            //if single of multi 
            if(value['amount'] === 'single'){
                completedReports.push(key)

                //if both isntead of toxic or pest 
                if(value['reportType'] === 'both'){

                    //loop throught the pest and toxins 
                    for(let i = 0; i < fileLocations[key].length; i++){
                        const  currentPath = fileLocations[key][i][key] 

                        let wb = new Excel.Workbook(); //shared in each of them 
                        await wb.xlsx.readFile(currentPath)

                        let headersWorksheet = wb.getWorksheet('Headers'); 

                        await copyClientInfo(headersWorksheet, clientInfo, jobNumber)
                        await singleCopyPestData(wb, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                        await wb.xlsx.writeFile(currentPath);

                    } 

                //Toxins or Pests 
                }else{

                    let wb = new Excel.Workbook(); 
                    await wb.xlsx.readFile(fileLocations[key])

                    let headersWorksheet = wb.getWorksheet('Headers'); 

                    await copyClientInfo(headersWorksheet, clientInfo, jobNumber)
                    await singleCopyPestData(wb, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                    await wb.xlsx.writeFile(fileLocations[key]);

                }

            }else{ 
                //while this can push multiple keys onto the complete reports page 
                if(value['reportType'] === 'both'){
                    for(let i = 0; i < fileLocations[key].length; i++){
                        const  currentPath = fileLocations[key][i][key] 

                        let wb = new Excel.Workbook(); 
                        await wb.xlsx.readFile(currentPath)

                        let headersWorksheet = wb.getWorksheet('Headers'); 

                        await copyClientInfo(headersWorksheet, clientInfo, jobNumber)

                        let completed = await multiCopyPestData(wb, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                        completedReports = completedReports.concat(completed) 

                        await wb.xlsx.writeFile(currentPath);
                    }

                //Toxins or Pests 
                }else {
                    
                    let wb = new Excel.Workbook(); 
                    await wb.xlsx.readFile(fileLocations[key])

                    let headersWorksheet = wb.getWorksheet('Headers'); 

                    await copyClientInfo(headersWorksheet, clientInfo, jobNumber)

                    let completed = await multiCopyPestData(wb, fileLocations, clientInfo, sampleNames, sampleOptions, sampleData, key, value)
                    completedReports = completedReports.concat(completed) 

                    await wb.xlsx.writeFile(fileLocations[key]);
                }


            }
        }

    }

}

exports.genereatePestReport = genereatePestReport; 
exports.processPestFile = processPestFile; 