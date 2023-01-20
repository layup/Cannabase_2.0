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

            //console.log('Phase 1')
            //console.log(dataSections)
            //console.log(budHeader)
            //console.log(budNames)


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
    //console.log(sampleName)
    //console.log(sampleData)
    //console.log(sampleNames)
    //console.log(sampleOptions)

    let headerSampleName = ''; 
    let headerRow, dataRow;
    let processed = [] 
    let counter = 1; 
    //console.log('Phase 2')
    //console.log(clientInfo[sampleName.substring(0,6)]['sampleNames'])

    for(let [key, value] of Object.entries(clientInfo[sampleName.substring(0,6)]['sampleNames'])){
        try{
            if(sampleOptions[key.toString()].amount === 'mult'){
                processed.push(key)
                headerSampleName += `${counter}) ${value}`  
                counter++; 
            } 
        } catch (error){
            console.log('Error with ', key)
            console.log(error)
        }
    }
    
    //console.log(processed)
    
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

    if(processed.length > 1){
        dataRow = dataWorksheet.getRow(1)

        for(let i = 1; i < processed.length; i++){
            
            dataRow.getCell(7 + i).value = `Sample ${1+i}`
        }
       
    }
    //console.log('Matching Samples:', processed)

    for(let j = 0; j < processed.length; j++){ 

        if(Object.keys(sampleData[processed[j]])){
            
            for(const [key2, value2] of Object.entries(sampleData[processed[j]])){
                let locaiton = (parseInt(key2) + 1)
                
                dataRow =  dataWorksheet.getRow(locaiton)
                
                dataRow.getCell((7 + j)).value = parseInt(value2)
                //dataRow.commit()
               
            }
        }

    }
    
    return processed

}



//void function, should probably try and split it out among different things 
const genereatePestReport = async (fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => { 

    console.log('Copying Pesticides Data')
    console.log(sampleOptions)

    let completedReports = [] 

    for(let [key, value] of Object.entries(sampleOptions)){
        //console.log('Phase 1')
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

exports.genereatePestReport = genereatePestReport; 
exports.processPestFile = processPestFile; 