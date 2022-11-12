import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'


const Job = () => {

    let id = useParams()

    const [loading, setLoading] = useState(true)
    const [jobData, setJobData] = useState(); 

    useEffect(() => {
        async function getJobData(){
            await window.api.getJobInfo(id.jobNum).then((value) => {
                setJobData(value[0]);
            }); 

        }
        //console.log('Running Job Search')
        getJobData()
        console.log(jobData)
        
    }, [])


    return (
        <div 
            className='bg-zinc-300 flex flex-col h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            {jobData && <div className='h-1/6 bg-red-100'>
                <h1>Job Id: {id.jobNum} </h1>
                <p>Recieve Date: {jobData.receive_date}</p>
                <p>Complete Date: </p>
                <p>Client: {jobData.client_name} </p>
                <p>Status: 0</p>
                <p></p>
            </div>} 

            <div className='h-5/6 grid grid-rows-3 grid-cols-3 gap-2'>
                <div className='row-span-2 col-span-2 bg-orange-200'>
                    test

                </div>
                <div className='row-span-3 col-span-1 bg-orange-100'>
                    test2 
                </div>
                <div className=' row-span-1 col-span-2 bg-orange-200 '>
                    Results 
                </div>


            </div>
        </div>
    
    )
}

export default Job