import React from 'react'

const NewJob = () => {
    return (
        <div 
            className=' flex flex-col h-screen max-w-screen  lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >  
            <div className='w-full bg-zinc-400 p-2'>
                <h1>New Job Entry</h1>
                <p>Job Number:</p>
                <p>Client: </p>
            </div>

            <div>
                <h1>Requested Tests</h1>
                <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700 w-1/6">
                    <input 
                        id="bordered-checkbox-1" 
                        type="checkbox" 
                        value="" 
                        name="bordered-checkbox" 
                        class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label 
                        for="bordered-checkbox-1" 
                        class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        Default radio
                    </label>
                </div>
                
            </div>

        </div>
    )
}

export default NewJob