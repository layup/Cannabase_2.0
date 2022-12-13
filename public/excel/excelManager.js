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


const copyTemplate = (jobNumbers) => { 
    const template_location = '/Users/layup/Documents/Programming/work /cannabase/cannabase2.0/public/excel/particles_template.xlsx'
        
    const reportsPath = store.get('reportsPath')
    
    return new Promise((resolve, reject) => {

        let fileLocations = []

        for(var i = 0; i < jobNumbers.length; i++ ){ 

            const folderName = path.join(reportsPath + "/" + jobNumbers[i]) 
            const fileName = path.join(jobNumbers[i] + "_Pesticides.xlsx")
            const fileLocation =  path.join(folderName + "/" + fileName) 

            if (!fs.existsSync(folderName)){
                fs.mkdirSync(folderName);
            }
            fs.copyFile(template_location, fileLocation, (err) => {
                if (err) throw err;
                console.log('Pesticides Template Copied to ', folderName);
            });

            fileLocations.push({[jobNumbers[i]]: fileLocation})

        //copy data into excel sheets 
        
        }   

        resolve(fileLocations)
    })

}

const copyClientInfo = async (fileLocation, clientInfo, samples, sampleData) => { 
    for(const [key, value] of Object.entries(fileLocation)){

        console.log(key, value)

        var wb = new Excel.Workbook(); 
        await wb.xlsx.readFile(value)
        var worksheet = wb.getWorksheet('Headers'); 
        var worksheet2 = wb.getWorksheet('SampleData')

        var row = worksheet.getRow(2)
        row.getCell(2).value = clientInfo[key].clientName
        row = worksheet.getRow(3)
        row.getCell(2).value = clientInfo[key].date 
        row = worksheet.getRow(4)
        row.getCell(2).value = clientInfo[key].time 
        row = worksheet.getRow(5)
        row.getCell(2).value = clientInfo[key].jobNum
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
        row.getCell(2).value = clientInfo[key].numSamples 
        row = worksheet.getRow(13)
        row.getCell(2).value = clientInfo[key].email
        row = worksheet.getRow(14)
        row.getCell(2).value = clientInfo[key].telephone 
        row = worksheet.getRow(15)
        row.getCell(2).value = clientInfo[key].recvTemp
        row = worksheet.getRow(16)
        row.getCell(2).value = clientInfo[key].paymentInfo

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
                    
                    row2.getCell((6 + j)).value = value2
                    row2.commit()
                   
                }
            }
        
        }

        wb.xlsx.writeFile(value);
        

    }
}

const copyClientData = async (fileLocation, samples, sampleData, clientInfo) => {

    for(const [key, value] of Object.entries(fileLocation)){
    
        let matchingSamples = []

        for(let i = 0; i < samples.length; i++){ 
            if(samples[i].substring(0,6) === key){
                matchingSamples.push(samples[i])
            }
        }


        for(let j = 0; j < matchingSamples.length; j++){ 
            //console.log(matchingSamples[j])
            //console.log(sampleData[matchingSamples[j]])

            if(Object.keys(sampleData[matchingSamples[j]])){
                
                //console.log(sampleData[matchingSamples[j]]) 

                for(const [key2, value2] of Object.entries(sampleData[matchingSamples[j]])){
                    console.log('Runninng: ', key2, value2)
                    console.log(key2, value2)
                    var wb = new Excel.Workbook(); 
                    console.log('running: ', value)
                    await wb.xlsx.readFile(value)
                    //var worksheet = wb.getWorksheet('SampleData')
                    console.log('testing')
                    console.log(wb)
                    //var row = worksheet.getRow(key2+1)
                    //row.getCell(key2+1).value = value2 
                    //row.commit()
                    //wb.xlsx.write(value)

                }
            }
        
        }

        
    
        
    } 
    

}


exports.generateReports =  async (clientInfo, samples, sampleData , jobNumbers) => { 
   
    console.log(clientInfo)
    console.log(samples)
    console.log(sampleData)
    console.log(jobNumbers)
    

    const promise1 = await copyTemplate(jobNumbers).then( async (fileLocations) => {
        console.log('Promise1 then')
        console.log(fileLocations)

        
        for (const fileLocation of fileLocations){ 
            await copyClientInfo(fileLocation,clientInfo, samples, sampleData)
            //await copyClientData(fileLocation, samples, sampleData, clientInfo)
            
            console.log('DONE')

            //write client data 
            //VBA: determine how many sample datas and when to write the last sheet 


        }
        

    })





}

exports.processExcelFile = (reportType, filePath) => {


    return new Promise((resolve, reject) => {
        const wb = xlsx.readFile(filePath)

        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length

        data = data.slice((dataRows-1) - 112, dataRows - 10);


        let budHeader = data[2]
        let budNames = data[1]
        let budLocations = []
        let jobNumbers = []
        let samples = []
        let sampleData = {}

        for (var key in budHeader) {
            //console.log(key + " -> " + temp[key]); 
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

    
        //create an object with 
        
        for (let i = 0; i < budLocations.length; i++){
            
            let tempData  ={}
        
            //console.log(budNames[budLocations[i]])
            //sampleData[budNames[budLocations[i]]] = budNames[budLocations[i]]


            data.forEach((item) => {
                if((typeof(item[budLocations[i]]) !== "undefined") && (typeof(item.__EMPTY_1) !== 'undefined')){
                    //console.log(item.__EMPTY_1, item[budLocations[i]])
                    tempData[item.__EMPTY_1] = item[budLocations[i]]
                    //sort as object with location and amount 

                }
            })

            sampleData[budNames[budLocations[i]]] = tempData

        }
        
        //console.log(sampleData)

        fs.writeFileSync('test.json',JSON.stringify(data))

        resolve({jobNumbers: jobNumbers, samples: samples, sampleData: sampleData})
    })

}


exports.processTxt = async (jobNumbers) => {
    console.log("Processing Text")
    const txtPath = path.normalize(store.get('txtPath'))
    

    let txtNames = []
    let regex = /TXT-.*/

    //scan the dir 
    const dirResults = await fs2.readdir(txtPath)
    

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
                email: ""
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
    let sampleNames = []; 

    var instream = fs.createReadStream(jobPath)
    var rl = readline.createInterface(instream); 

    let counter = 0; 

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
                    email = line.substring(20,50).trim()
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        paymentInfo = paymentInfo[0]
                    }
                }

            }
            if(counter === 7){
                if(attention){
                    email = line.substring(20,50).trim()
                    paymentInfo = line.match(/(PD) (\w+) (\w+)/)
                    if(paymentInfo){
                        paymentInfo = paymentInfo[0]
                    } 
                }
            }

            counter++; 
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
        email: email
    }

}