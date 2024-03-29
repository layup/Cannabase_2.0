
const path = require('path')
const Excel = require('exceljs');


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

               
                if(cell.text.match(/(\d+)-[0-9]{1,2}$/)){    
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
 * Copy the formula to a current cell 
 * @param {String} formulaName - select the formula
 * @param {String} letter - column in which the data is located in the excel file 
 * @returns {Array} - two objects in the array, first being value, second being percentage of the value, thrid being unit mass (mg/unit)
 */ 
const thcExcelFormuals = (formulaName, letter, unitType) => {

    switch(formulaName){

        case 'sampleName': 
            return {formula: `=IF(ISBLANK(Data!$${letter}$1),  "BLANK", Data!$${letter}$1)`, result:''}
        case 'unit':
            return {formula:`=IF(ISBLANK(Data!$${letter}$2), "", Data!${letter}$2)`, result: ''}

        case 'CBDV':   
            return [
                {formula: `=IF(Data!$${letter}$4 = 0, "ND", Data!$${letter}$4)`, result:''},
                {formula: `=IF(Data!$${letter}$4 = 0, "ND", Data!$${letter}$4/10)`, result:''},
                {formula: `=IF(Data!$${letter}$4 = 0, "ND", Data!$${letter}$4 * Data!$${letter}$22)`, result:''}
            ]
        
        case 'CBDVA':    
            return [
                {formula: `=IF(Data!$${letter}$5 = 0, "ND", Data!$${letter}$5)`, result:''},
                {formula: `=IF(Data!$${letter}$5 = 0, "ND", Data!$${letter}$5/10)`, result:''},
                {formula: `=IF(Data!$${letter}$5 = 0, "ND", Data!$${letter}$5 * Data!$${letter}$22)`, result:''}
                
            ]
        case 'THCV':   
            return [
                {formula: `=IF(Data!$${letter}$6 = 0, "ND", Data!$${letter}$6)`, result:''},
                {formula: `=IF(Data!$${letter}$6 = 0, "ND", Data!$${letter}$6/10)`, result:''},
                {formula: `=IF(Data!$${letter}$6 = 0, "ND", Data!$${letter}$6 * Data!$${letter}$22)`, result:''}
            ]

        case 'CBC':     
            return [
                {formula: `=IF(Data!$${letter}$17 = 0, "ND", Data!$${letter}$17)`, result:''},
                {formula: `=IF(Data!$${letter}$17 = 0, "ND", Data!$${letter}$17/10)`, result:''},
                {formula: `=IF(Data!$${letter}$17 = 0, "ND", Data!$${letter}$17 * Data!$${letter}$22)`, result:''}
            ]
        
        case 'CBCA':    
            return [
                {formula: `=IF(Data!$${letter}$21 = 0, "ND", Data!$${letter}$21)`, result:''},
                {formula: `=IF(Data!$${letter}$21 = 0, "ND", Data!$${letter}$21/10)`, result:''},
                {formula: `=IF(Data!$${letter}$21 = 0, "ND", Data!$${letter}$21 * Data!$${letter}$22)`, result:''}
            ]

        case 'CBD': 
            return [
                {formula: `=IF(Data!$${letter}$8 = 0, "ND", Data!$${letter}$8)`, result:''},
                {formula: `=IF(Data!$${letter}$8 = 0, "ND", Data!$${letter}$8/10)`, result:''},
                {formula: `=IF(Data!$${letter}$8 = 0, "ND", Data!$${letter}$8 * Data!$${letter}$22)`, result:''}
            ]

        case 'CBG':   
            return [
                {formula: `=IF(Data!$${letter}$9 = 0, "ND", Data!$${letter}$9)`, result:''},
                {formula: `=IF(Data!$${letter}$9 = 0, "ND", Data!$${letter}$9/10)`, result:''},
                {formula: `=IF(Data!$${letter}$9 = 0, "ND", Data!$${letter}$9 * Data!$${letter}$22)`, result:''}
            ]
        case 'CBGA':  
            return [
                {formula: `=IF(Data!$${letter}$12 = 0, "ND", Data!$${letter}$12)`, result:''},
                {formula: `=IF(Data!$${letter}$12 = 0, "ND", Data!$${letter}$12/10)`, result:''},
                {formula: `=IF(Data!$${letter}$12 = 0, "ND", Data!$${letter}$12 * Data!$${letter}$22)`, result:''}
            ]
        
        case 'THCVA':  
            return [
                {formula: `=IF(Data!$${letter}$13 = 0, "ND", Data!$${letter}$13)`, result:''},
                {formula: `=IF(Data!$${letter}$13 = 0, "ND", Data!$${letter}$13/10)`, result:''},
                {formula: `=IF(Data!$${letter}$13 = 0, "ND", Data!$${letter}$13 * Data!$${letter}$22)`, result:''}
            ]
        
        case 'CBL':  
            return [
                {formula: `=IF(Data!$${letter}$16 = 0, "ND", Data!$${letter}$16)`, result:''},
                {formula: `=IF(Data!$${letter}$16 = 0, "ND", Data!$${letter}$16/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$16 = 0, "ND", Data!$${letter}$16 * Data!$${letter}$22)`, result:''}
            ]
        case 'CBLA': 
            return [
                {formula: `=IF(Data!$${letter}$20 = 0, "ND", Data!$${letter}$20)`, result:''},
                {formula: `=IF(Data!$${letter}$20 = 0, "ND", Data!$${letter}$20/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$20 = 0, "ND", Data!$${letter}$20 * Data!$${letter}$22)`, result:''}
            ]

        case "CBDA":  
            return [
                {formula: `=IF(Data!$${letter}$10 = 0, "ND", Data!$${letter}$10)`, result:''},
                {formula: `=IF(Data!$${letter}$10 = 0, "ND", Data!$${letter}$10/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$10 = 0, "ND", Data!$${letter}$10 * Data!$${letter}$22)`, result:''}
            ]

        case 'CBNA': 
            return [
                {formula: `=IF(Data!$${letter}$18 = 0, "ND", Data!$${letter}$18)`, result:''},
                {formula: `=IF(Data!$${letter}$18 = 0, "ND", Data!$${letter}$18/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$18 = 0, "ND", Data!$${letter}$18 * Data!$${letter}$22)`, result:''} 
            ]
        case "CBN": 
            return [
                {formula: `=IF(Data!$${letter}$11 = 0, "ND", Data!$${letter}$11)`, result:''},
                {formula: `=IF(Data!$${letter}$11 = 0, "ND", Data!$${letter}$11/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$11 = 0, "ND", Data!$${letter}$11 * Data!$${letter}$22)`, result:''}
            ]

        case 'THCA': 
            return [
                {formula: `=IF(Data!$${letter}$19 = 0, "ND", Data!$${letter}$19)`, result:''},
                {formula: `=IF(Data!$${letter}$19 = 0, "ND", Data!$${letter}$19/10)`, result:''}, 
                {formula: `=IF(Data!$${letter}$19 = 0, "ND", Data!$${letter}$19 * Data!$${letter}$22)`, result:''}
            ]
        
        case 'd9-THC':  
            return [
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14)`, result:''},
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14/10)`, result:'' }, 
                {formula: `=IF(Data!$${letter}$14 = 0, "ND", Data!$${letter}$14 * Data!$${letter}$22)`, result:''}
            ]
        case 'd8-THC':  
            return [
                {formula: `=IF(Data!$${letter}$15 = 0, "ND", Data!$${letter}$15)`, result:''},
                {formula: `=IF(Data!$${letter}$15 = 0, "ND", Data!$${letter}$15/10)`, result:'' }, 
                {formula: `=IF(Data!$${letter}$15 = 0, "ND", Data!$${letter}$15 * Data!$${letter}$22)`, result:''}
            ]

        case 'total-THC':
            return [
                {formula: `=SUM(Data!$${letter}$14, Data!$${letter}$19 * 0.877)`, result:''},
                {formula: `=SUM(Data!$${letter}$14/10, (Data!$${letter}$19/10) * 0.877)`, result:''}, 
                {formula: `=SUM(Data!$${letter}$14 * Data!$${letter}$22 , (Data!$${letter}$19 * Data!$${letter}$22) * 0.877)`, result:''},
                
            ]

        case 'total-CBD':
            return [
                {formula: `=SUM(Data!$${letter}$8, Data!$${letter}$10 * 0.877)`, result:''},
                {formula: `=SUM(Data!$${letter}$8/10, (Data!$${letter}$10/10) * 0.877)`, result:''},
                {formula: `=SUM(Data!$${letter}$8 * Data!$${letter}$22 , (Data!$${letter}$10 * Data!$${letter}$22) * 0.877)`, result:''},
            ]

        case 'unitValue':
            return [
                {formula: `=IF(ISBLANK(Data!$${letter}$22), "", Data!$${letter}$22)`, result:''}
            ]

        default: 
            return 'Invalid Statment'
        
    }

}

const copyFormating = (row, formulaName, dataLocation, unitType) => {

    const letter = getColumnDescription(dataLocation)
    const letter2 = getColumnDescription(dataLocation + 1 )

    let temp = thcExcelFormuals(formulaName, letter)
    let temp2 = thcExcelFormuals(formulaName, letter2)
    
    row.getCell(2).value = temp[0]
    row.getCell(4).value = temp2[0] 
    if(unitType !== 'unitMass'){
        row.getCell(3).value = temp[1]
        row.getCell(5).value = temp2[1]
    }else{
        row.getCell(3).value = temp[2]
        row.getCell(5).value = temp2[2]
    }

}

const replaceFirstTableInformation = (packageType, showExtraRow, reportType) => {
    
    const letter = String.fromCharCode(2+ 'A'.charCodeAt(0))
    const letter2 = String.fromCharCode(3 + 'A'.charCodeAt(0))


    console.log(letter, letter2)

    if(packageType === 'basic'){
        for(var i = 13; i <22; i++){
            let row = reportType.getRow(i);  

            if(i === 13){
                copyFormating(row, 'd9-THC', 2, 'unitMass')
            }

            if(i === 14){
                copyFormating(row, 'THCA', 2, 'unitMass')
            }
            if(i === 15 ){
                copyFormating(row, 'total-THC', 2, 'unitMass')
            }
            if(i === 16){
                copyFormating(row, 'd8-THC', 2, 'unitMass') 
            }
            if(i === 17){
                copyFormating(row, 'CBD', 2, 'unitMass') 
            }
            if(i === 18){
                copyFormating(row, 'CBDA', 2, 'unitMass') 
            }
            if(i === 19 ){
                copyFormating(row, 'total-CBD', 2, 'unitMass')  
            }
            if(i === 20){
                copyFormating(row, 'CBN', 2, 'unitMass')  
            }
            if(i === 21){
                copyFormating(row, 'CBNA', 2, 'unitMass')  
            }

        }

    }else{ 
        for(var j = 13; j <32; j++){
            let row = reportType.getRow(j);  

            if(j === 13){
                copyFormating(row, 'd9-THC', 2, 'unitMass')
            }
            if(j === 14){
                copyFormating(row, 'THCA', 2, 'unitMass')
            }
            if(j === 15){
                copyFormating(row, 'total-THC', 2, 'unitMass')
            }
            if(j === 16){
                copyFormating(row, 'd8-THC', 2, 'unitMass') 
            }
            if(j === 17){
                copyFormating(row, 'CBC', 2, 'unitMass') 
            }
            if(j === 18){
                copyFormating(row, 'CBCA', 2, 'unitMass') 
            }
            if(j === 19){
                copyFormating(row, 'CBD', 2, 'unitMass') 
            }
            if(j === 20){
                copyFormating(row, 'CBDA', 2, 'unitMass') 
            }
            if(j === 21){
                copyFormating(row, 'total-CBD', 2, 'unitMass')  
            }
            if(j === 22){
                copyFormating(row, 'CBG', 2, 'unitMass')  
            }
            if(j === 23){
                copyFormating(row, 'CBGA', 2, 'unitMass')  
            }            
            if(j === 24){
                copyFormating(row, 'CBL', 2, 'unitMass')  
            }
            if(j === 25){
                copyFormating(row, 'CBLA', 2, 'unitMass')  
            }
            if(j === 24){
                copyFormating(row, 'CBL', 2, 'unitMass')  
            }
            if(j === 25){
                copyFormating(row, 'CBLA', 2, 'unitMass')  
            }
            if(j === 26){
                copyFormating(row, 'CBDV', 2, 'unitMass')  
            }
            if(j === 27){
                copyFormating(row, 'CBDVA', 2, 'unitMass')  
            }
            if(j === 28){
                copyFormating(row, 'THCV', 2, 'unitMass')  
            }
            if(j === 29){
                copyFormating(row, 'THCVA', 2, 'unitMass')  
            }
            if(j === 30){
                copyFormating(row, 'CBN', 2, 'unitMass')  
            }
            if(j === 31){
                copyFormating(row, 'CBNA', 2, 'unitMass')  
            }
        }
    }

}

const getColumnDescription = (i) => {
    const m = i % 26;
    const c = String.fromCharCode(65 + m);
    const r = i - m;
    return r > 0
        ? `${getColumnDescription((r - 1) / 26)}${c}`
        : `${c}`
}


const pasteTables = (packageType, tableSize, runningCount, currentPage, reportType, dataLocation, unitType) => {
    

    const letter = getColumnDescription(dataLocation)
    const letter2 = getColumnDescription(dataLocation + 1 )

    console.log('letter1: ', letter, ' letter2: ', letter2)
    console.log(packageType)
    //console.log('test column value: ', getColumnDescription(dataLocation))

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
                copyFormating(row2, 'd9-THC', dataLocation, unitType)
            }

            if(row1Value === 14 + runningCount){
                //console.log('copying THCA to:', row2Value)
                copyFormating(row2, 'THCA', dataLocation, unitType)
            }
            if(row1Value === 15 + runningCount){
                copyFormating(row2, 'total-THC', dataLocation, unitType)
            }
            if(row1Value === 16 + runningCount){
                copyFormating(row2, 'd8-THC', dataLocation, unitType) 
            }
            if(row1Value === 17 + runningCount){
                copyFormating(row2, 'CBD', dataLocation, unitType) 
            }
            if(row1Value === 18 + runningCount){
                copyFormating(row2, 'CBDA', dataLocation, unitType) 
            }
            if(row1Value === 19 + runningCount){
                copyFormating(row2, 'total-CBD', dataLocation, unitType)  
            }
            if(row1Value === 20 + runningCount){
                copyFormating(row2, 'CBN', dataLocation, unitType)  
            }
            if(row1Value === 21 + runningCount){
                copyFormating(row2, 'CBNA', dataLocation, unitType)  
            }
            if(tableSize === 12 && row1Value === 22 + runningCount){
                let temp = thcExcelFormuals('unitValue', letter)
                let temp2 = thcExcelFormuals('unitValue', letter2)
                row2.getCell(2).value = temp[0]
                row2.getCell(4).value = temp2[0]
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
                copyFormating(row2, 'd9-THC', dataLocation, unitType)
            }

            if(row1Value === 14 + runningCount){
                copyFormating(row2, 'THCA', dataLocation ,unitType)
            }
            if(row1Value === 15 + runningCount){
                copyFormating(row2, 'total-THC', dataLocation, unitType)
            }
            if(row1Value === 16 + runningCount){
                copyFormating(row2, 'd8-THC', dataLocation, unitType) 
            }
            if(row1Value === 17 + runningCount){
                copyFormating(row2, 'CBC', dataLocation, unitType) 
            }
            if(row1Value === 18 + runningCount){
                copyFormating(row2, 'CBCA', dataLocation, unitType) 
            }
            if(row1Value === 19 + runningCount){
                copyFormating(row2, 'CBD', dataLocation, unitType) 
            }
            if(row1Value === 20 + runningCount){
                copyFormating(row2, 'CBDA', dataLocation, unitType) 
            }
            if(row1Value === 21 + runningCount){
                copyFormating(row2, 'total-CBD', dataLocation, unitType)  
            }
            if(row1Value === 22 + runningCount){
                copyFormating(row2, 'CBG', dataLocation, unitType)  
            }
            if(row1Value === 23 + runningCount){
                copyFormating(row2, 'CBGA', dataLocation, unitType)  
            }            
            if(row1Value === 24 + runningCount){
                copyFormating(row2, 'CBL', dataLocation, unitType)  
            }
            if(row1Value === 25 + runningCount){
                copyFormating(row2, 'CBLA', dataLocation, unitType)  
            }
            if(row1Value === 24 + runningCount){
                copyFormating(row2, 'CBL', dataLocation, unitType)  
            }
            if(row1Value === 25 + runningCount){
                copyFormating(row2, 'CBLA', dataLocation, unitType)  
            }
            if(row1Value === 26 + runningCount){
                copyFormating(row2, 'CBDV', dataLocation, unitType)  
            }
            if(row1Value === 27 + runningCount){
                copyFormating(row2, 'CBDVA', dataLocation, unitType)  
            }
            if(row1Value === 28 + runningCount){
                copyFormating(row2, 'THCV', dataLocation, unitType)  
            }
            if(row1Value === 29 + runningCount){
                copyFormating(row2, 'THCVA', dataLocation, unitType)  
            }
            if(row1Value === 30 + runningCount){
                copyFormating(row2, 'CBN', dataLocation, unitType)  
            }
            if(row1Value === 31 + runningCount){
                copyFormating(row2, 'CBNA', dataLocation, unitType)  
            }
            if(tableSize === 22 && row1Value === 32 + runningCount){
                let temp = thcExcelFormuals('unitValue', letter)
                let temp2 = thcExcelFormuals('unitValue', letter2)
                row2.getCell(2).value = temp[0]
                row2.getCell(4).value = temp2[0]
            }
            
        }

        currentPage+=tableSize
                        
        if(tableSize === 22){
            //FIXME: Why does it do this 
            currentPage--; 
            reportType.mergeCells(currentPage, 2, currentPage, 3 )
            reportType.mergeCells(currentPage, 4, currentPage, 5 )
            currentPage++; 
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

const basicReport = (reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage, showExtraRow, unitType) => {
    
    console.log('BASIC REPORT')
    console.log(reportSampleHeader)

    let test = true; 
    let tableSize; 

    if(showExtraRow){
        tableSize = 12; 
    }else{
        tableSize = 11; 
    }

    let runningCount = 0;
    //starting at E
    let currentTables = 4; 

    //let pageStart = [9,52, 92, 132, 172]
    let pageStart = [9, 55, 98, 141, 184] 

    //selet the page shift amount after the first couple of pages 
    for(let i = 1; i < 15; i++){
        pageStart.push(141 + i * 40)
    }
    console.log("Page Start: ", pageStart)
    //let pageStart2 = [9,48, 86, 123, 160, 197] //automatic 
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
            let row = reportType.getRow(currentPage); 
            row.getCell(1).style = sampleStyle 
            row.getCell(1).value = value2[0]
            row.height = 16; 
        }                      
        //adds border and set height 
        if(parseInt(key2) > 0){
            //console.log('Adding border to row:', (currentPage+1))
            let temp = (currentPage+1); 
            let row3 = reportType.getRow(temp);
        
            for(let i = 1; i< 9; i++){ 
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
            if((totalPages === 0 && remainder > 2) || (totalPages === 1) || totalPages > 2){
       
                //top and bottom spacing 
                currentPage++; 
                currentPage += tableSize; 
                currentPage++; 
                
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables,unitType)
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

                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType,currentTables, unitType)
                    currentTables+=2; 
                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables, unitType)
                    currentTables+=2; 

                    if(runningCount !== 0){
                        currentPage++; 
                    } 

                }else{
                    //currentPage++; 
                    if(runningCount === 0){
                        currentPage++; 
                    }
                    currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables, unitType)  
                    currentTables+=2; 
                }

                pastingAdditoinalInfo(copyText, currentPage, reportType)

            }else{
                //not last page so create two tables 
                currentPage++; 
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType,currentTables, unitType)
                currentTables+=2; 
                currentPage = pasteTables('Basic', tableSize, runningCount, currentPage, reportType, currentTables, unitType)
                currentTables+=2; 
                currentPage++; 

                //write contiune to next page section 
                let row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 
            }
        }
    }
}

const deluxeReport = (reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage, showExtraRow) => {

    console.log("running deluxe report generation")

    let test = true; 
    let tableSize; 


    if(showExtraRow){
        tableSize = 22; 
     
    }else{
        tableSize = 21; 
    
    }

    let runningCount = 0;

    //starting at E
    let currentTables = 4; 

    //let pageStart = [9,50, 89, 128, 167, 206, 245, 284, 323, 362]
    //let pageStart = [9,50, 92, 133, 173, 212, 251, 290, 329, 368]
    let pageStart = [9,53, 97, 141, 185, 229, 273, 317, 361, 405, 449, 493]
    let sampleStyle = reportType.getRow(9).getCell(1).style; 
    console.log('sampleStyle', sampleStyle)
    
    let totalPages = Math.floor(usedSamples/2)
    //let remainder = usedSamples % 2; 
    //console.log('usedSamples: ', usedSamples)
    //console.log('total Pages: ', totalPages)
    //console.log('remainder: ', remainder)

    for(let [key2, value2] of Object.entries(reportSampleHeader)){
        console.log(`Key: ${key2}, Value: ${value2}`)

        let currentPage = pageStart[key2]

        if(tableSize === 21 && parseInt(key2) !== 0){
            currentPage++; 
        }

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
            console.log('page secret: ', currentPage)
            let row = reportType.getRow(currentPage); 
            row.getCell(1).style = sampleStyle 
            row.getCell(1).value = value2[0]
            row.height = 16; 
            
        }                      
        //adds border and set height 
        if(parseInt(key2) > 0){
            let temp = (currentPage+1); 
            let row3 = reportType.getRow(temp);
        
            for(let i = 1; i< 9; i++){ 
                row3.getCell(i).border = {top: {style: 'thin'}}
            }
            reportType.getRow(temp).height = 8; 
        }

        currentPage++;

        
        if(tableSize === 21 && parseInt(key2) === 0){
            reportType.getRow(32 + runningCount).hidden = true; 
            currentPage++; 
        }

        //clear the tex below and add continue to next page 
        if(parseInt(key2) === 0){
            if(totalPages > 0){      

                currentPage = 33; 
                //clear row that is getting copied 
                let row = reportType.getRow(currentPage); 

                for(var i = 0; i < 12; i++){
                    let row2 = reportType.getRow(34 + i)
                    row2.getCell(1).style = row.getCell(1).style; 
                    row2.getCell(1).value = ''
                    row2.getCell(4).style = row.getCell(1).style; 
                    row2.getCell(4).value = ''
                    row2.getCell(5).style = row.getCell(1).style; 
                }

                currentPage++; 
                currentPage++; 
                row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 
            }


        //copy table and check if end 
        }else{
            currentPage++;             
            currentPage = pasteTables('Deluxe', tableSize, runningCount, currentPage, reportType, currentTables)
            //currentPage++; 
            currentTables+=2; 
            
            //not sure why we do this but it works lol 
            if(runningCount !== 0){
                currentPage++; 
            }  

            //contiune page or write additonal ending information 
            if(parseInt(key2) === totalPages){
                pastingAdditoinalInfo(copyText, currentPage, reportType)
                
            }else{ 
                currentPage++; 
                let row = reportType.getRow(currentPage); 
                row.getCell(1).value = continuedNextPage; 
            }
        }

    }
        

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

    //if there is name for the samples upon processing will assign a name 
    console.log('doing thing')
    let usedSamples = Object.keys(clientInfo[sampleNames[0].substring(0,6)]['sampleNames'])
    let difference = sampleNames.filter(x => !usedSamples.includes(x));


    for(let [key, value] of Object.entries(sampleOptions)){
    
        //console.log(key, value)
        //console.log(fileLocations[key])
        if(!completedReports.includes(key)){

            console.log('Completed Reports:', completedReports)

            console.log('--------Copying General Info-----------')
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



            //single or multi report sort of deal 
            let jobSamplesName = []
            let jobSamplesNumber = []
            
            //determine how many samples 
            if(sampleOptions[key].amount === 'single'){
                console.log("single report")

                completedReports.push(key)
                jobSamplesName.push(clientInfo[key.substring(0,6)].sampleNames[key])
                jobSamplesNumber.push(key)

            }else{
                console.log('multi report ')
                for(var [key3, value3] of Object.entries(clientInfo[key.substring(0,6)].sampleNames)){
                
                    if(sampleNames.includes(key3)){
                        if(sampleOptions[key3].amount !== 'single'){
                            jobSamplesNumber.push(key3)
                            jobSamplesName.push(value3)
                            completedReports.push(key3)
                        }
                    }
                }
            }

            console.log('jobSamplesName:' , jobSamplesName)
            console.log('jobSamplesNumber: ',completedReports) 

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

            //add something for Unit Mass 
            let showExtraRow = false; 
            console.log(jobSamplesNumber)

            jobSamplesNumber.forEach((job,index) => {

                console.log(index, job)
                let jobLocations = {}
                let jobCannaValues = {}
                let counter = 3; 

                let row = dataWorksheet.getRow(1)
                let headerRow = headersWorksheet.getRow(28); 
                row.getCell(currentCell).value = 'Sample ' + (index + 1); 
                row = dataWorksheet.getRow(2)
                row.getCell(currentCell).value = "(mg/g)"

                
                if(sampleOptions[job]['unitType'] === 'moisture'){
                    //row.getCell(currentCell).value = "(mg/g)"
                    //showExtraRow = true; 

                    if(sampleOptions[job]['unit'] !== ''){
                        headerRow.getCell(2).value = `Moisture ${sampleOptions[job]['unit']}`
                    
                    }else {
                        headerRow.getCell(2).value = 'Moisture (%)'
                    }
                
                }
                
                if(sampleOptions[job]['unitType'] === 'density'){  
                    row.getCell(currentCell).value = "(mg/ml)"
                    
                    //showExtraRow = true; 

                    if(sampleOptions[job]['unit'] !== ''){
                        headerRow.getCell(2).value = `Density ${sampleOptions[job]['unit']}`
                    
                    }else {
                        headerRow.getCell(2).value = 'Density (mg/ml)'
                    }
                    
                }
                //FIXME: Unit and Unit Value 
                if(sampleOptions[job]['unitType'] === 'unitMass'){
                    let headerRow2 = headersWorksheet.getRow(29); 

                    //row.getCell(currentCell).value = "(mg/g)"
                    //showExtraRow = true;

                    if(sampleOptions[job]['unit'] !== ''){
                        headerRow.getCell(2).value = `Unit Mass ${sampleOptions[job]['unit']}`
                        headerRow2.getCell(2).value = sampleOptions[job]['unit']
                    }else {
                        headerRow.getCell(2).value = 'Unit Mass (mg/unit)'
                        headerRow2.getCell(2).value = '(mg/unit)'
                    }



                }
                //FIXME: need to remove the mg/g | might just remove this option all togeather 
                if(sampleOptions[job]['unitType'] === 'percentage'){
                    row.getCell(currentCell).value = "(mg/g)"
                }
                


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

                //have an if condition 
                if(sampleOptions[job]['unitValue'] !== ''){
                    showExtraRow = true; 
                    row = dataWorksheet.getRow(22)
                    console.log(parseFloat(sampleOptions[job]['unitValue']))
                    if(isNaN(parseFloat(sampleOptions[job]['unitValue']))){
                        row.getCell(currentCell).value = 0
        
                    }else{
                        row.getCell(currentCell).value = parseFloat(sampleOptions[job]['unitValue'])
                    }
                   
                }
               
        
            
                currentCell++; 
                sampleJobData[job] = jobCannaValues
            })         

            console.log(sampleJobData);

            console.log('----------Table Copying--------------')


            //if it is UnitMass I need to reformulate the section start tables 
            if(sampleOptions[key]['unitType'] === 'unitMass'){
                console.log('Replacing First Section')
                replaceFirstTableInformation(sampleOptions[key].reportType, showExtraRow, reportType)
            }


            //maybe have an inital run that copies 
            //pass in sample option, all good until the Unit Mass Section 
            if(sampleOptions[key].reportType === 'basic'){
                
                basicReport(reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage, showExtraRow, sampleOptions[key]['unitType']);

                if(showExtraRow){
                    console.log('trying to merge')
                    try{
                        reportType.mergeCells(23, 2, 23, 3 )
                        reportType.mergeCells(23, 4, 23, 5 ) 
                    }catch (err){
                        console.log(err)
                    }
                }

            }else{
                console.log('deluz')
                deluxeReport(reportType, usedSamples, reportSampleHeader, copyText, continuedNextPage, showExtraRow);


            }

            await wb.xlsx.writeFile(fileLocations[key]);

        }

    }

    

}


exports.generateThcReport = generateThcReport; 
exports.processThcFile = processThcFile; 