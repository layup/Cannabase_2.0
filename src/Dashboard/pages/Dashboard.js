import React, {useEffect, useState} from 'react'

import Header from '../components/header/Header'
import MainTable from '../components/table/MainTable'

async function test(database) {
    console.log("running test")
    console.log('test', database())
}

function Dashboard() {


    return (
        <div 
            className='bg-zinc-300 flex flex-col h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            <div className='rounded-lg h-1/6 mb-2' >
                <Header /> 
            </div>

            <div className=' bg-white rounded-lg h-5/6 mt-2 overflow-x-auto overflow-y-auto' >
                <MainTable />
            </div>

           {window.api.getNoComplete}

        </div>
  )
}

export default Dashboard