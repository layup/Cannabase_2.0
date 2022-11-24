import React, { useEffect, useState } from 'react'

const Settings = () => {

    const [databasePath, setDatabasePath] = useState()

    const openFile = async (callpack) => {
        await window.api.openFile().then((value) => {
            setDatabasePath(value)
        })   
    }


    return (
        <div
            className=' flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >
            <div className='flex flex-col space-y-2 p-2 w-full'>

                <h2>File Location</h2>

                <div>
                    
                    <h1>SQL Database Path </h1>  
                    <div className='space-x-2 bg-orange-200'>             
                        <button
                            onClick={openFile}
                            className='border-2 border-black w-fit p-1'
                        >
                            Set File Location 
                        </button>
                        <input 
                            type='text'
                            className='border-2 border-zinc-200 w-1/2 p-1'
                            value={databasePath}
                        />
                    </div>
                </div>            
                <div className='space-x-2'>
                    <button className='bg-gray-200 p-2 rounded-md'>Dismiss All Changes</button>
                    <button className='bg-emerald-200 p-2 rounded-md'>Save All Changes</button>
                </div>

            </div>
            

        </div>
    )
}

export default Settings