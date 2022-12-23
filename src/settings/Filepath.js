import React from 'react'

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Filepath = (props) => {
    return (
        <div className='p-1 items-center'>
            <h1 className='font-medium text-sm'>{props.title}</h1>  
            <div className='space-x-2  w-1/2'> 
                <input 
                    type='text'
                    className='border-2 border-zinc-200 w-3/4 p-1 px-2 text- '
                    value={props.currentPath}
                    disabled
                />                
                <button
                    onClick={() => props.setPath(props.path)}
                    className='bg-white hover:bg-gray-100 text-gray-800 font-semi py-1 px-3 border border-gray-400 rounded shadow'
                >
                    Browse
                  
                </button>
            </div>
            <p className=' text-sm text-zinc-600'>{props.description}</p>
        </div>
    )
}

export default Filepath