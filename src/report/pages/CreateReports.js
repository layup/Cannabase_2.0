import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const CreateReports = (props) => {

    const location = useLocation(); 

    const [jobNumbers, setJobNumbers] = useState("")
    const [samples, setSamples] = useState("")
    const [sampleData, setSampleData] = useState("")
    const [clientInfo, setClientInfo] = useState("")

    // console.log(location.state.fileName)
    //console.log(location.state.filePath)
    //console.log(location.state.selectReport)

    useEffect(() => {
        async function processExcelFile(){
            await window.api.processExcelFile(location.state.selectReport, location.state.filePath).then(({jobNumbers, samples, sampelData}) => {
                setJobNumbers(jobNumbers)
                setSamples(samples)
                setSampleData(sampleData)
            })
        }        
        processExcelFile();
    }, [])

    useEffect(() => {
        async function processTxt(){
            await window.api.processTxt(jobNumbers)
        }

        processTxt()

    }, [jobNumbers])

    return (
        <div 
            className=' flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >    
            <div className=' w-full flex justify-between p-4 border-b-2'>
                <div className=''>
                    <h1 className='text-xl font-medium'>Reports</h1>
                    <div className='flex space-x-2'>
                        <p>FileName:</p>
                        <p className='text-zinc-400'>{location.state.fileName}</p>
                    </div>
                </div>
                <button className='border-1 p-2 rounded-md bg-blue-400 text-white '>
                    Generate Report
                </button>
                
            </div>
            <div className='bg-orange-400 w-full'>

                
            </div>
        </div>
    )
}

export default CreateReports