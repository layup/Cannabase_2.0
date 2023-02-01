import React, {useEffect, useState} from 'react'



let saveFile = async (data) => {

    var todayDate = new Date().toISOString().slice(0, 10);


    //let element = document.createElement("a");
    //let file = new Blob([content], {type: "text/plain"});
    //element.href = URL.createObjectURL(file);
    //element.download = "printer.txt";
    //element.click();
    //console.log(file)
    
    let win = window.open("", "Printer", "width=860,height=640");

    win.document.write(`<pre>ACTIVE CANNABIS JOBS LIST (Generated on: ${todayDate})\n\n</pre>`)
    win.document.write("<pre>JOB        RECEIVED      CLIENT                                                                TESTS\n</pre>")
    data.map((item) => {
        let content2 = "" 
        let remainder = 70 - item.client_name.length; 
    
        content2 += "W" + item.job_number + "    "
        content2 += item.receive_date + "    "
        content2 += item.client_name + ' '.repeat(remainder)
        content2 += item.tests 
        content2 += "\n"

        win.document.write(`<pre>${content2}</pre>`)
    })

    win.print()
    
}

const DashboardHeader = ({activeJobs}) => {

    const [data, setData] = useState([])

    useEffect(() => {
        async function getData(){
            await window.api.getNotCompleteJobs().then((value) => {
                setData(value)
            });

        }
        getData()

    }, []); 

    return (
            <div className='p-4 bg-zinc-200 flex justify-between items-center'>
                <p>Active Jobs: {activeJobs}</p>
                <button 
                    className='bg-emerald-700 text-white py-2 px-3 rounded-md hover:bg-emerald-800' 
                    id='current' 
                    onClick={() => saveFile(data)}
                >
                    Print Active Jobs
                </button>
            </div>
    )
}

export default DashboardHeader