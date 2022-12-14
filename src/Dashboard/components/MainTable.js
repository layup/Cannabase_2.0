import React, {useEffect, useState} from 'react'


import JobsTableHeader from '../../shared/components/Table/JobsTableHeader'
import JobsTableContent from '../../shared/components/Table/JobsTableContent'

const MainTable = (props) => {

    const [data, setData] = useState([])

    useEffect(() => {
        async function getData(){
            await window.api.getNotCompleteJobs().then((value) => {
                setData(value)
                //console.log(value.length)
                props.setActiveJobs(value.length)
                
            });

        }
        getData()
        //console.log(data)

    }, []); 


    return (
        <div className='w-full h-full'> 
            <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                <JobsTableHeader />
                <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                    {data && data.map((item) => {
                        return (
                            
                            <JobsTableContent 
                                key={item.id + "_" + item.job_number}
                                jobNum={item.job_number}
                                test={item.tests}
                                company={item.client_name}
                                receive_date={item.receive_date}
                                status={item.status}
                            /> 
                        )
                    })}
                </tbody>
            </table> 
           
        </div>
    )
}

export default MainTable