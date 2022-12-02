import React, { useEffect, useState } from 'react'

import {useParams, useLocation} from 'react-router-dom'

import TableHeader from '../../shared/components/Table/TableHeader';
import TableContent from '../../shared/components/Table/TableContent';
import Search from '../../shared/components/Navigation/Search';

const Client = () => {

    let data = useLocation()

    const [jobs, setJobs] = useState(); 

    useEffect(() => {
        async function getClientJobs(){
            await window.api.getClientJobs(data.state).then((value) => {
                setJobs(value)
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
                

            </div>

            <div className='overflow-auto h-screen'>
            <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                <TableHeader />

                <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                    {jobs && jobs.map((item) => {
                        return (
                            <TableContent 
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

                <tfoot className='sticky bottom-0 bg-emerald-800 w-full p-2 hidden '>
                    <tr className='[&>*]:p-2'>
                        <td>Sum</td> 
                        <td></td> 
                        <td></td> 
                        <td></td> 
                        <td></td> 
                        <td></td> 
                    </tr>
                </tfoot>
            </table>
            
        </div>
             
        </div>
    )
}

export default Client