import React from 'react'

function Search() {
    return (
        <div>
            <h4>Search Job</h4>
            <input 
                type="text" 
                placeholder='Search' 
                className='w-full border-1 border-zinc-500 rounded-lg p-1  '
            /> 
        </div>
    )
}

export default Search