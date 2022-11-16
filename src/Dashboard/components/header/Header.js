import React, { useEffect, useState } from 'react'

import Search from './Search'

import DownloadButton from './DownloadButton'

function Header() {

    
    //let names = window.parseInt.getNames(); 

    return (
        <div className='w-full h-full '>
            <div className='bg-white w-full p-2 rounded-lg'>
                <Search />
                <div>
                    <p className='p-2'>Filters</p>

                </div>                

            </div>

        </div>
    )
}

export default Header