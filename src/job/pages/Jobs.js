import React, { useEffect, useState } from 'react'
import Search from '../../shared/components/Navigation/Search';
import TableHeader from '../../shared/components/Table/TableHeader';
import TableContent from '../../shared/components/Table/TableContent';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

const Jobs = () => {

    const [totalJobs, setTotalJobs] = useState(); 
    const [Jobs, setJobs] = useState([]); 
    const [rowShow, setrowShow] = useState(25);
    const [page, setPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(); 
    const [filters, setFilters] = useState(true);
    
    

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


        console.log(totalJobs)
        console.log("total jobss", Jobs)

    }, [totalJobs])


    //interal search of the jobs 
    return (
        <div 
            className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
          
            <Search />
            <div className='bg-zinc-200 p-4 flex space-x-3'>
                <div className='flex space-x-2 px-1 justify-center items-center text-emerald-600'>
                    <FilterListIcon />
                </div>

                <button className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500 hover:border-emerald-600 hover:border-1 ' >
                    <p className=''>Tests</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                <button className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Client</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                <button className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Status</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                <button className='bg-zinc-300 px-2 p-1 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Date Created</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

            </div>
        
            {filters && 
                <div className='px-4 py-2 bg-zinc-200 flex space-x-4 border-t-1 border-zinc-400'>
                    <p className='space-x-2'>
                        <span className='uppercase'>Tests:</span> 
                        <span className='font-medium'>Metals</span>
                        <CloseIcon className='text-emerald-600'/>
                    </p>

                    <p className='text-emerald-600'>Clear</p>
                
                </div>
            
            }

            <div className='overflow-auto h-screen'>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                    <TableHeader />
                
    
                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {Jobs && Jobs.map((item) => {
                            return (
                                <TableContent 
                                    key={item.id}
                                    jobNum={item.job_number}
                                    test={item.tests}
                                    company={item.client_name}
                                    receive_date={item.receive_date}
                                    complete_date={item.complete_date}
                                    status={0}
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