import React, { useEffect, useState } from 'react'
import Search from '../../shared/components/Navigation/Search';
import JobsTableHeader from '../../shared/components/Table/JobsTableHeader';
import JobsTableContent from '../../shared/components/Table/JobsTableContent';

//import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Filters from '../components/filter/Filters';

const Jobs = () => {

    const [totalJobs, setTotalJobs] = useState(); 
    const [Jobs, setJobs] = useState([]); 
    const [rowShow, setrowShow] = useState(25);
    //const [page, setPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(); 
 
    useEffect(() => {
        async function getTotalJobs(){
            await window.api.getTotalJobs().then((value) => {
                setTotalJobs(Object.values(value)[0]);
                
            }); 
        }
        //getTotalJobs();
        //console.log('total job:', totalJobs);

        async function getAllJobs(){
            await window.api.getAllJobs().then((value) => {
                setJobs(value);
                setTotalJobs(value.length)
            })
        }
        getAllJobs();

    },[])

    //determine how many to display at once 
    useEffect(() => {

        let remainder = totalJobs % rowShow
        //470 % 25 = 20 

        if(totalJobs <= rowShow) {
            setTotalPages(1)
        }else {
            

        }

        //console.log(totalJobs)
        //console.log("total jobss", Jobs)

    }, [totalJobs])


    //interal search of the jobs 
    return (
        <div 
            className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
          
            <Search />

            {/*  <Filters /> **/}
            <div className='bg-zinc-200 p-4 flex space-x-3 text-center'>
                <p>Filters section coming soon! </p>
            </div>

            <div className='overflow-auto h-screen'>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                    <JobsTableHeader />
    
                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {Jobs && Jobs.map((item) => {
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

            <div className=' py-1 px-10 bg-emerald-700 text-white w-full'>
                <p className='text-right'>Total Jobs Shown: {totalJobs}</p>
            </div>
        </div>
        
    )
}

export default Jobs