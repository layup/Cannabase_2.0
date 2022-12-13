import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ClientInfoItem from '../component/ClientInfoItem';


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
            await window.api.processExcelFile(location.state.selectReport, location.state.filePath).then(({jobNumbers, samples, sampleData}) => {

                
                setJobNumbers(jobNumbers)
                setSamples(samples)
                setSampleData(sampleData)

            })
        }        
        processExcelFile();
    }, [])

    useEffect(() => {
        async function processTxt(){
            await window.api.processTxt(jobNumbers).then((data) => {
                setClientInfo(data);
            })
        }

        processTxt()
        console.log(Object.keys(clientInfo))

    }, [jobNumbers])

    const updateClientInfo = ( jobNum, keyName, value) => {
        setClientInfo((prevState) => ({
            ...prevState,
            [jobNum]: {
                ...prevState[jobNum],
                [keyName]: value
            }
        }))
    }

    const generateReports = async () => {
        console.log('generating reports')

        await window.api.generateReports(clientInfo, samples, sampleData, jobNumbers)
    }

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
                    <p className=''>Total Jobs: <span className='text-zinc-400'>{jobNumbers.length}</span></p>
                </div>
                <button 
                    className='border-1 p-2 rounded-md bg-blue-400 text-white h-12 '
                    onClick={generateReports}
                >
                    Generate Report
                </button>
                
            </div>
            <div className='w-full h-full'>
            
                <table className='table-auto md:table-fixed w-full text-xs md:text-base '>
                    <tr className='bg-emerald-700'>
                        <td></td>
                        {jobNumbers && Object.keys(clientInfo).map((jobNum) => {
                            return (<th className="p-2 text-white font-medium text-sm" scope="col" key={jobNum}>{jobNum}</th>) 
                        })}
                    </tr>
                    <ClientInfoItem 
                        title={"Client Name"}
                        clientInfo={clientInfo}
                        keyName={"clientName"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Date"}
                        clientInfo={clientInfo}
                        keyName={"date"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Time"}
                        clientInfo={clientInfo}
                        keyName={"time"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Attention"}
                        clientInfo={clientInfo}
                        keyName={"attention"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Address 1"}
                        clientInfo={clientInfo}
                        keyName={"addy1"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Address 2"}
                        clientInfo={clientInfo}
                        keyName={"addy2"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Address 3"}
                        clientInfo={clientInfo}
                        keyName={"addy3"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Sample Type"}
                        clientInfo={clientInfo}
                        keyName={"sampleType1"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Sample Type 2"}
                        clientInfo={clientInfo}
                        keyName={"sampleType2"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Number of Samples"}
                        clientInfo={clientInfo}
                        keyName={"numSamples"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Recieve Temp"}
                        clientInfo={clientInfo}
                        keyName={"recvTemp"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Telephone"}
                        clientInfo={clientInfo}
                        keyName={"telephone"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Email"}
                        clientInfo={clientInfo}
                        keyName={"email"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Fax"}
                        clientInfo={clientInfo}
                        keyName={"fax"}
                        onChange={updateClientInfo}
                    /> 
                    <ClientInfoItem 
                        title={"Payment Info"}
                        clientInfo={clientInfo}
                        keyName={"paymentInfo"}
                        onChange={updateClientInfo}
                    /> 


                </table>

            </div>

            <div>
                <h1>Samples</h1>
            </div>


        </div>
    )
}

export default CreateReports