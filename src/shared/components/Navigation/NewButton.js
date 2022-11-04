import React from 'react'

import AddIcon from '@mui/icons-material/Add';

const NewButton = (props) => {
    return (
        <button className='bg-emerald-700 text-white rounded-md p-1 md:p-2 lg:px-8 bg-emeral-700 w-full hover:bg-emerald-800' >
            <div className='flex justify-between w-full'>
                <p className='pr-8 hidden lg:block'>{props.text}</p>
                <div className='bg-white rounded-full'>
                    <AddIcon className='text-emerald-700'/>
                </div>

            </div>
        </button>
    )
}

export default NewButton