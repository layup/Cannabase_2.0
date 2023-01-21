//const { useDebugValue } = require('react');
const Store = require('electron-store')
var dbmanager = require('./dbmanager')
var db = dbmanager.db 

const store = new Store(); 

exports.getNotCompleteJobs = () => {

    return new Promise((resolve, reject) => {
        //const sql = 'SELECT * FROM cannajobs2022 WHERE job_number in (SELECT job_number FROM cannajobs_tests2022 WHERE status = 0) ORDER BY receive_date DESC'  
        const sql = 'SELECT * FROM cannabase_jobs WHERE Status = 0 ORDER BY job_number DESC'
        console.log('Running getNotComplete(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                
                //resolve(row ? row.id: null)
                resolve(row)
            }
        })
    })
}

exports.getJobInfo = (jobNum) => {
    return new Promise((resolve, reject) => {
        //const sql = `SELECT * FROM cannajobs2022 WHERE job_number = ${jobNum}`  
        const sql = `SELECT * FROM cannabase_jobs WHERE job_number = ${jobNum}`  
        console.log('Running getJobInfo(): ', sql);
        
         db.get(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    }) 
}

exports.getTotalJobs = () => {
    return new Promise((resolve, reject) => {
        //const sql = `SELECT COUNT(job_number) FROM cannajobs2022 `  
        const sql = `SELECT COUNT(job_number) FROM cannabase_jobs `
        console.log('Running getJobInfo(): ', sql);
        
         db.get(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })  
}

exports.getAllJobs = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cannabase_jobs ORDER BY job_number DESC`  
        console.log('Running getAllJobs(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })   
}

exports.getTests = (jobNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cannabase_tests WHERE job_number = ${jobNum} ORDER BY status ASC`  
        console.log('Running jobInfo(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    }) 
}

exports.searchJobs = (jobNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cannabase_jobs WHERE job_number LIKE  '${jobNum}%' LIMIT 50;`  
        console.log('Running searchJobs(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    }) 
}

exports.getJobNotes = (jobNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT note FROM cannabase_notes WHERE job_number = ${jobNum}`  
        console.log('Running searchJobs(): ', sql);
        
        //let jobNotes = []

         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                //console.log(row[row.length-1])
                resolve(row[row.length-1])
            }
        })
    }) 
}

exports.updateNotes = (jobNum, note) => {
    console.log(note)
    //INSERT OR IGNORE INTO cannabase_notes (job_number, notes) VALUES ('Karen', 34)
    //UPDATE my_table SET age = 34 WHERE name='Karen'
    return new Promise((resolve, reject) => {
        const SQL = 
        `
            INSERT OR REPLACE INTO cannabase_notes (job_number, note) VALUES ('${jobNum}', '${note}')
            
        `  
        console.log('Running updateNotes(): ', SQL);
        
         db.run(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                //console.log(row)
                resolve(row)
            }
        })
    }) 
}

exports.setJobNotes = (jobNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT note FROM cannabase_notes WHERE job_number = ${jobNum}`  
        console.log('Running searchJobs(): ', sql);
        
         db.run(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                console.log(row)
                resolve(row)
            }
        })
    }) 

    
}

exports.createNewJob = (jobNum, clientName, tests, notes) => {
    //1. insert into cannajobs_test DONE
    //2. insert into cannajobs2022 DONE 
    //3. opt: insert canna_ustomers 
    //4. insert notes 
    //5. sertalize data creation 

    jobNum = jobNum.replace(/\D+/g, '');

    var today = new Date(); 

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return new Promise((resolve, reject) => {
        console.log(tests)
        for(var i = 0; i < tests.length; i++){
            const SQL = 
            `
                INSERT INTO cannabase_tests (job_number, test_type, submit_date, status) 
                VALUES("${jobNum}", ${tests[i]}, "${today}", 0)
            `
            console.log("Running createNewJob(): ",SQL)
            db.run(SQL, (err,row) => {
                if(err){
                    console.log(err.message)
                    reject(err)
                }
                resolve(console.log(`INSERTED INTO cannabase_tests`))
            })
        }
        const SQL2 = 
        `
            INSERT INTO cannabase_jobs (job_number, tests, client_name, receive_date, status)
            VALUES("${jobNum}", '${tests}', '${clientName}', '${today}', 0) 
        ` 
        console.log("Running createNewJob(): ",SQL2)
        db.run(SQL2, (err,row) => {
            if(err){
                console.log(err.message)
                reject(err)
            }
            resolve(console.log(`INSERTED INTO cannabase_jobs`))
        })

        if(notes){
            const SQL3 = 
            `
                INSERT INTO cannabase_notes (job_number, note, note_date)
                VALUES("${jobNum}", '${notes}', '${today}') 

            ` 
            db.run(SQL3, (err,row) => {
                if(err){
                    console.log(err.message)
                    reject(err)
                }
                resolve(console.log(`INSERTED INTO cannabase_notes`))
            })
        }

        this.clientExists(clientName).then((value) => {
            if(value){
                console.log("client exist")
            }else{
                const SQL4 = `INSERT INTO canna_customers (company_id, client_name, status) VALUES (0, "${clientName}", 1)`
                db.run(SQL4, (err,row) => {
                    if(err){
                        console.log(err.message)
                        reject(err)
                    }
                    resolve(console.log(`INSERTED INTO canna_customers`))
                })
            }
        })

        
    })

    
}

exports.deleteJob = (jobNum) => {

    return new Promise((resolve, reject) => {
        const SQL = `DELETE FROM cannabase_jobs WHERE job_number == ${jobNum};`
        const SQL2 = `DELETE FROM cannabase_tests WHERE job_number == ${jobNum};`
        const SQL3 = `DELETE FROM cannabase_notes WHERE job_number == ${jobNum};`

        console.log("Running deleteJob()")
        db.run(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }
            resolve()
        })
        db.run(SQL2, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }
            resolve()
        })
        db.run(SQL3, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }
            resolve()
        })
    })

}

exports.setJobStatus = (jobNum, status) => {
    return new Promise((resolve, reject) => {

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        today = yyyy + '-' + mm + '-' + dd;

        let SQL = ``

        if(status === 0 ){
            SQL = `UPDATE cannabase_jobs SET status = ${status}, complete_date = null WHERE job_number = ${jobNum}`
        }else{
            SQL = `UPDATE cannabase_jobs SET status = ${status}, complete_date = '${today}' WHERE job_number = ${jobNum}`
        }
      

        console.log("Running setJobStatus(): ", SQL)
        db.run(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }
            resolve()
        })
    })
}

exports.getTestStatus =(jobNum, testNum) => {
    return new Promise((resolve, reject) => {
        //const sql = `SELECT status from cannajobs_tests2022 WHERE job_number == ${jobNum} and test_type  == ${testNum}`  
        const sql = `SELECT status from cannabase_jobs WHERE job_number == ${jobNum} and test_type  == ${testNum}`  
        console.log('Running jobInfo(): ', sql);
        
         db.get(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    }) 
}

exports.setTestsStatus = (jobNum, testNum, status) => {
    return new Promise((resolve, reject) => {

        let sql = `
            UPDATE cannabase_tests 
            SET status = ${status}
            WHERE job_number = ${jobNum} AND test_type= ${testNum};
        `  

        if(status === 1){
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = yyyy + '-' + mm + '-' + dd;
            
            sql =`
                UPDATE cannabase_tests 
                SET status = ${status}, complete_date='${today}'
                WHERE job_number = ${jobNum} AND test_type= ${testNum};
            `  
        }
        console.log('Running setTestsStatus(): ', sql);
        
         db.run(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }
            resolve(console.log(`${row} updated : ${this.changes}`))
        })
    }) 
    
}

exports.getAllClients = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT client_name FROM canna_customers ORDER BY client_name COLLATE NOCASE ASC`  
        console.log('Running getAllClients(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })  
}

exports.clientSearch = (clientName) => {

    return new Promise((resolve, reject) => {
        const SQL = `SELECT DISTINCT  client_name FROM canna_customers WHERE client_name LIKE '${clientName}%' ORDER BY client_name COLLATE NOCASE ASC`


        db.all(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}
exports.searchClient = (clientName) => {

    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cannabase_jobs WHERE client_name LIKE '${clientName}%' LIMIT 50;`  
        console.log('Running searchJobs(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    }) 
}


//edit this 

exports.clientExists = (clientName) => {

    return new Promise((resolve, reject) => {
        const SQL = `SELECT client_name FROM canna_customers WHERE client_name = '${clientName}%'`

        console.log('running client exists')

        db.get(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

exports.getClientJobs = (clientName) => {
    return new Promise((resolve, reject) => {
        const SQL = `SELECT * FROM cannabase_jobs WHERE client_name = '${clientName}' ORDER BY job_number DESC`

        db.all(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}


exports.getNumberClients = () => {
    return new Promise((resolve, reject) => {
        const SQL = `SELECT DISTINCT  client_name FROM canna_customers WHERE client_name GLOB '[0-9]*'`


        db.all(SQL, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

exports.getStorePathLocations = () => {
    
    return store.store 

}