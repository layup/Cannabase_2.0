import React, { useEffect, useState } from 'react'

import {useParams, useLocation} from 'react-router-dom'

import JobsTableHeader from '../../shared/components/Table/JobsTableHeader';
import JobsTableContent from '../../shared/components/Table/JobsTableContent';
import Search from '../../shared/components/Navigation/Search';

const Client = () => {
    let data = useLocation()

    const [jobs, setJobs] = useState(); 
    const [totalJobs, setTotalJobs] = useState() 

    useEffect(() => {
        async function getClientJobs(){
            await window.api.getClientJobs(data.state).then((value) => {
                setJobs(value)
                setTotalJobs(value.length)
            })
        }

        getClientJobs()
        console.log(jobs)

    }, [])

    console.log(data)

    return (
        <div 
            className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >   
            <Search />
            <div className='p-3'>
                <h1>{data.state}</h1>
                <h1>Total Jobs: {totalJobs}</h1>
            </div>

            <div className='overflow-auto h-screen'>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                    <JobsTableHeader />

                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {jobs && jobs.map((item) => {
                            return (
                                <JobsTableContent 
                                    key={item.id}
                                    jobNum={item.job_number}
                                    test={item.tests}
                                    company={item.client_name}
                                    receive_date={item.receive_date}
                                    complete_date={item.complete_date}
                                    status={item.status}
                                /> 
                            )
                        })}
                    </tbody>


                </table>

                
            </div>

            <div className=' py-1 px-10 bg-emerald-700 text-white w-full'>
                <p className='text-right'>Total Jobs: {totalJobs}</p>
            </div>
        </div>
    )
}

export default Client