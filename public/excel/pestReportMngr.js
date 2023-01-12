const Excel = require('exceljs');
const xlsx = require('xlsx')
const path = require('path')

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
    
    return processed

}



//void function, should probably try and split it out among different things 
const genereatePestReport = async (fileLocations, clientInfo, sampleNames, sampleData, sampleOptions) => { 

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

exports.genereatePestReport = genereatePestReport; 
exports.processPestFile = processPestFile; 