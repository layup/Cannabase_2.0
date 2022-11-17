import React, { useEffect, useState } from 'react'

import Search from './Search'

import DownloadButton from './DownloadButton'
import SearchIcon from '@mui/icons-material/Search';

function Header() {

    
    //let names = window.parseInt.getNames(); 

    return (
        <div>
            <div className='bg-emerald-700 p-4 flex'>
                <div className='p-2 bg-emerald-800'>
                    <SearchIcon className='text-white bg-emerald-800'/>
                </div>

                <input 
                    type='search' 
                    placeholder='Search Active Job' 
                    className='w-full p-1 bg-emerald-800 text-white border-transparent focus:border-transparent focus:ring-0 outline-none'
                />
            </div>

            <div className='bg-zinc-100 h-20'>
                <p>Active Jobs: </p>
                <p>Total Jobs:</p>
            </div>
        </div>
    )
}

export default Header