import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'

import test_image from '../../assets/test_image.jpg'

const Job = () => {

    let id = useParams()

    const [loading, setLoading] = useState(true)
    const [jobData, setJobData] = useState(); 

    useEffect(() => {
        async function getJobData(){
            await window.api.getJobInfo(id.jobNum).then((value) => {
                setJobData(value);
                console.log(jobData)
            }); 

        }
        getJobData()
    }, [])


    return (
        <div 
            className='bg-zinc-300 flex flex-col h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            {<div className='h-1/6 bg-red-100 flex justify-between items-center'>
                <div className='bg-red-200'>
                    <h1>Job Id: {id.jobNum} </h1>
                    <p>Recieve Date: {jobData && jobData.receive_date}</p>
                    <p>Complete Date: N/A</p>
                    <p>Client: {jobData && jobData.client_name} </p>
                    <p>Status: 0</p>
                </div>

                <div className='mx-2 bg-white'>
                    <button className='border-black border-1 p-2 rounded-md'>Generate Word</button>
                </div>
    
            </div>} 

            <div className='h-5/6 grid grid-rows-3 grid-cols-3 gap-2'>
                <div className='row-span-2 col-span-2 bg-orange-200'>
                    Notes

                    
                </div>
                <div className='row-span-3 col-span-1 bg-orange-100 flex flex-col items-center overflow-y-auto'>
                    <h1 className='images bg-red-200 w-full text-center'>Images</h1> 
                    <div className='bg-white my-2 '>
                        <img src={test_image} classname='' alt='weed'/>
                       <p className='text-center py-2'>W12913</p>
                    </div>
                    <div className='bg-white my-2 '>
                        <img src={test_image} classname='' alt='weed'/>
                        <p className='text-center py-2'>W12913</p>
                    </div>
                    <div className='bg-white my-2 '>
                        <img src={test_image} classname='' alt='weed'/>
                        <p className='text-center py-2'>W12913</p>
                    </div>
                    
                </div>
                <div className=' row-span-1 col-span-2 bg-orange-200 '>
                    Results 
                </div>


            </div>
        </div>
    
    )
}

export default Job