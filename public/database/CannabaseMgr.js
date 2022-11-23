const { useDebugValue } = require('react');
var dbmanager = require('./dbmanager')
var db = dbmanager.db 


exports.getNotComplete = () => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cannajobs2022 WHERE job_number in (SELECT job_number FROM cannajobs_tests2022 WHERE status = 0) ORDER BY receive_date DESC'  
        console.log('Running getNotComplete(): ', sql);
        
         db.all(sql, (err,row) => {
            if(err) {
                console.error(err.message)
                reject(err)
            }else{
                //console.log(row);
                //resolve(row ? row.id: null)
                resolve(row)
            }
        })
    })
}

exports.getJobInfo = (jobNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cannajobs2022 WHERE job_number = ${jobNum}`  
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
        const sql = `SELECT COUNT(job_number) FROM cannajobs2022 `  
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
        const sql = `SELECT * FROM cannajobs2022 ORDER BY job_number DESC`  
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
        const sql = `SELECT * FROM cannajobs_tests2022 WHERE job_number = ${jobNum} ORDER BY status ASC`  
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
        const sql = `SELECT * FROM cannajobs2022 WHERE job_number LIKE  '${jobNum}%' LIMIT 25;`  
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

}

exports.createNewJob = (jobNum, clientName, tests, notes) => {
    //1. insert into cannajobs_test 
    //2. insert into cannajobs2022
    //3. opt: insert canna_ustomers
    //4. insert notes 

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
                INSERT INTO cannajobs_tests2022 (job_number, test_type, submit_date, status) 
                VALUES("${jobNum}", ${tests[i]}, "${today}", 0)
            `
            console.log("Running createNewJob(): ",SQL)
            db.run(SQL, (err,row) => {
                if(err){
                    console.log(err.message)
                    reject(err)
                }
                resolve(console.log(`INSERTED INTO cannajobs_tests2022`))
            })
        }
        const SQL2 = 
        `
            INSERT INTO cannajobs2022 (job_number, tests, client_name, receive_date, status)
            VALUES("${jobNum}", '${tests}', '${clientName}', '${today}', 0) 
        ` 
        console.log("Running createNewJob(): ",SQL2)
        db.run(SQL2, (err,row) => {
            if(err){
                console.log(err.message)
                reject(err)
            }
            resolve(console.log(`INSERTED INTO cannajobs_tests2022`))
        })
        
    })

    


}

exports.getTestStatus =(jobNum, testNum) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT status from cannajobs_tests2022 WHERE job_number == ${jobNum} and test_type  == ${testNum}`  
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
            UPDATE cannajobs_tests2022 
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
                UPDATE cannajobs_tests2022 
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
        const sql = `SELECT DISTINCT client_name FROM canna_customers ORDER BY client_name ASC`  
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