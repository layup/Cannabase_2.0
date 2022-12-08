const {shell, ipcRenderer, BrowserWindow, dialog, remote, } = require('electron')
const Store = require('electron-store');
const fs = require('fs');
const path = require('path')
const xlsx = require('xlsx')
var readline = require('readline');


const { promises: fs2 } = require("fs");


const store = new Store()

exports.scanReportsFolder = (jobNum) => {

    var reportsDir = store.get('reportsPath')
    var currentPath = path.join(reportsDir, jobNum)
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

//return job numbers, spikes and recovery 
exports.processExcelFile = (reportType, filePath) => {
    //return the bud names 

    return new Promise((resolve, reject) => {
        const wb = xlsx.readFile(filePath)

        //console.log(wb.SheetNames)
        
        const ws = wb.Sheets[wb.SheetNames[0]];

        let data = xlsx.utils.sheet_to_json(ws)
        let dataRows = Object.keys(data).length

        //console.log(dataRows)

        data = data.slice((dataRows-1) - 112, dataRows - 10);
        //console.log(data.length)


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
    
        //console.log(budLocations)

        //get all the unique job numbers
        for(var key2 in budLocations){
            //console.log(key2, budNames[budLocations[key2]])

            samples.push(budNames[budLocations[key2]])
            let jobNumber = budNames[budLocations[key2]].substring(0,6)

            if(!jobNumbers.includes(jobNumber)){
                jobNumbers.push(jobNumber)
            }

        }

        
        console.log("TESINGS")
        console.log(samples)
        console.log(jobNumbers)

        //create an object with 
        
        for (let i = 0; i < budLocations.length; i++){
            
            let tempData  ={}
        
            console.log(budNames[budLocations[i]])
            //sampleData[budNames[budLocations[i]]] = budNames[budLocations[i]]


            data.forEach((item) => {
                if((typeof(item[budLocations[i]]) !== "undefined") && (typeof(item.__EMPTY_1) !== 'undefined')){
                    console.log(item.__EMPTY_1, item[budLocations[i]])

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
    const txtPath = store.get('txtPath')

     
       
    let txtNames = []
    let regex = /TXT-.*/

    //scan the dir 
    const dirResults = await fs2.readdir(txtPath)
    //console.log(dirResults)

    //scan for TXT-MONTH files 
    dirResults.forEach((file) => {
        if(file.match(regex)){
            txtNames.push(file)
        }
    })

    let clientPath = {}

    //check for the file location and if they exists 
    for(let i = 0; i < jobNumbers.length; i++){
        for(let j = 0; j < txtNames.length; j++) {
            let newPath = txtPath + "/" + txtNames[j] + "/W" + jobNumbers[i] + ".txt"
            if(fs.existsSync(newPath)){
                clientPath[jobNumbers[i]] = newPath; 
            }
        }    
    }
    
    //console.log(clientPath)

    let results = {}
    for(var clientKey in clientPath){
        console.log(clientKey)
        let temp = await GenerateClientData(clientKey, clientPath[clientKey])
        console.log(temp)
    }

    //var instream = fs.createReadStream(clientPath[171316])

    //let temp = await GenerateClientData(171316, clientPath[171316])
    //console.log(temp)
    
   
} 

const  GenerateClientData = async (jobNum, jobPath) => {

    //console.log("Generating Client Data")

    let clientName, date, time; 
    let attention; 
    let addy1, addy2, addy3; 
    let sampleType1, sampleType2, numSamples; 
    let temp; 
    let paymentInfo; 
    let telephone, fax; 
    let email; 
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
                    temp = line.match(/((\d+).[\d]C)/)[0]
                }
             
            }

            //fax
            if(counter === 5 ){
                if(attention){
                     telephone = line.substring(20,50).replace('TEL:', '').trim()
                     temp = line.match(/((\d+).[\d]C)/)[0]
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
        addy1: addy1, 
        addy2: addy2,
        addy3: addy3, 
        sampleType1: sampleType1, 
        sampleType2: sampleType2, 
        numSamples: numSamples,
        temp: temp, 
        paymentInfo: paymentInfo, 
        telephone: telephone,
        fax: fax,  
        email: email
    }

   


}