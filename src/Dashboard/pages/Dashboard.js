import React from 'react'

function Dashboard() {
    return (
        <div 
            className='bg-zinc-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-10 gap-4 h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            <div className='col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-orange-200 '>
                Header
            </div>
            <div className='col-span-1 md:col-span-2 lg:col-span-3 row-span-9 bg-orange-200' >
                <table>
                <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Country</th>
                </tr>
                <tr>
                    <td>Alfreds Futterkiste</td>
                    <td>Maria Anders</td>
                    <td>Germany</td>
                </tr>
                <tr>
                    <td>Centro comercial Moctezuma</td>
                    <td>Francisco Chang</td>
                    <td>Mexico</td>
                </tr>
                </table> 
            </div>
        </div>
  )
}

export default Dashboard