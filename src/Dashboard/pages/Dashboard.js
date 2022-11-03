import React from 'react'

function Dashboard() {
    return (
        <div 
            className='bg-zinc-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-10 gap-4 h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            <div className='col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-orange-200 '>
                Header
            </div>
            <div className='col-span-1 md:col-span-2 lg:col-span-2 row-span-9 bg-orange-300 p-2 rounded-lg' >
                <table className='table-fixed w-full text-sm md:text-base'>
                    <thead className='bg-green-100'>
                        <tr className=''>
                            <th>Job Number#</th>
                            <th>Tests</th>                            
                            <th>Client</th>
                            <th>Status</th>
                            <th>Submission Date</th>
                            <th>Complete Date</th>

                        </tr>
                    </thead>
                    <tbody className='text-xs md:text-base text-center'>
                        <tr>
                            <td>Alfreds Futterkiste</td>
                            <td>Alfreds Futterkiste</td>
                            <td>Alfreds Futterkiste</td>
                            <td>Maria Anders</td>
                            <td>Germany</td>
                        </tr>
                        <tr>
                            <td>Centro comercial Moctezuma</td>
                            <td>Francisco Chang</td>
                            <td>Mexico</td>
                            <td>Alfreds Futterkiste</td>
                            <td>Alfreds Futterkiste</td>
                        </tr>                    
                    </tbody>
                </table> 
            </div>

            <div className='bg-orange-200 col-span-1 md:col-span-2 lg:col-span-1 row-span-9 rounded-lg p-2'>
                <p>Overview</p>
            </div>
        </div>
  )
}

export default Dashboard