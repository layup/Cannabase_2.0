import React from 'react'

import TableHeader from './TableHeader'
import TableContent from './TableContent'

const MainTable = () => {
    return (
        <div className='w-full h-full '> 
            <table className='table-auto md:table-fixed w-full text-sm md:text-base'>
                <TableHeader />
                <tbody className='text-xs md:text-base text-center h-full '>
                    <TableContent 
                        jobNum={170912}
                        test="Mushrooms " 
                        status={0}
                        company="Smoker Farms LTD"
                        subDate="11/03/2022"
                    /> 
                    <TableContent 
                        jobNum={170869}
                        test="Potenct, Pests, M.A" 
                        status={0}
                        company="Visionary Extracts"
                        subDate="10/07/2022"
                    /> 


                </tbody>
            </table> 
        </div>
    )
}

export default MainTable