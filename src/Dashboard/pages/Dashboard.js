import React, {useState} from 'react'
import Search from '../../shared/components/Navigation/Search'

import MainTable from '../components/MainTable'

function Dashboard() {

    const [activeJobs, setActiveJobs] = useState()


    return (
        <div 
            className=' flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            
            <Search /> 
            <div className='p-4 bg-zinc-200'>
                <p>Active Jobs: {activeJobs}</p>
            </div>

            <div className=' bg-white h-screen overflow-auto ' >
                <MainTable setActiveJobs={setActiveJobs} />

            </div>

            <div className='bg-emerald-700 p-2 text-white space-x-2'>
                <p className='px-10'>Active Jobs: {activeJobs}</p>
            </div> 
        </div>
  )
}

export default Dashboard