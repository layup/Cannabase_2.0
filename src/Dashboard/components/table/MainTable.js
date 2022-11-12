import React, {useEffect, useState} from 'react'

import TableHeader from './TableHeader'
import TableContent from './TableContent'

const MainTable = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        async function getData(){
            await window.api.getNotComplete().then((value) => {
                setData(value)
            });

        }
        getData()
        //console.log(data)

    }, []); 


    return (
        <div className='w-full h-full'> 
            <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                <TableHeader />
                <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                    {data && data.map((item) => {
                        return (
                            <TableContent 
                                key={item.id}
                                jobNum={item.job_number}
                                test={item.tests}
                                company={item.client_name}
                                receive_date={item.receive_date}
                                status={0}
                            /> 
                        )
                    })}
                </tbody>
            </table> 
        </div>
    )
}

export default MainTable