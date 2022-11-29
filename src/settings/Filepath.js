import React from 'react'

const Filepath = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>  
            <div className='space-x-2 bg-orange-200'>             
                <button
                    onClick={() => props.setPath(props.path)}
                    className='border-2 border-black w-fit p-1'
                >
                    Set File Location 
                </button>
                <input 
                    type='text'
                    className='border-2 border-zinc-200 w-1/2 p-1'
                    value={props.currentPath}
                    disabled
                />
            </div>
        </div>
    )
}

export default Filepath