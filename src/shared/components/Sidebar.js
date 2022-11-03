import React from 'react'

import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import WindowIcon from '@mui/icons-material/Window';
import WorkIcon from '@mui/icons-material/Work';
import ArchiveIcon from '@mui/icons-material/Archive';
import StorageIcon from '@mui/icons-material/Storage';

function Sidebar() {
    return (
        <div className='fixed top-0 left-0 w-full h-16 md:w-16 lg:w-56 md:h-full'>
            <div className='bg-white h-full lg:py-4 flex flex-row justify-around md:justify-start md:flex-col items-center md:items-stretch drop-shadow-md'>
                <div className='hidden lg:flex justify-center pt-2 pb-10 items-center'>
                    <StorageIcon className='text-emerald-700 '/>
                    <p className=' text-2xl text-center font-medium text-emerald-700' >Cannabase</p>
                
                </div>
                <div className='md:pt-10 py-2 lg:py-4 grid place-items-center '>
                    <button className='bg-emerald-700 text-white rounded-md p-1 md:p-2 lg:px-8 bg-emeral-700' >
                        <div className='flex '>
                            <p className='pr-8 hidden lg:block'>New Job</p>
                            <AddIcon />
                        </div>
                    </button>
                </div>

                <div className='flex md:flex-col justify-between '>
                    <div className=' flex p-4 text-emerald-600 md:bg-gray-200 pl-4 md:border-r-4 border-emerald-600'>
                        <WindowIcon className=''/>
                        <p className='px-3 hidden lg:block'>Dashboard</p>
                    </div>

                    <div className=' flex p-4 text-zinc-600'>
                        <WorkIcon className=''/>
                        <p className='px-3 hidden lg:block'>Clients</p>
                    </div>

                    <div className=' flex p-4 text-zinc-600'>
                        <WorkIcon className=''/>
                        <p className='px-3 hidden lg:block'>Jobs</p>
                    </div>

                    <div className=' flex p-4 text-zinc-600'>
                        <ArchiveIcon className=''/>
                        <p className='px-3 hidden lg:block'>Archives</p>
                    </div>

                    <div className=' flex p-4 text-zinc-600'>
                        <SettingsIcon className=''/>
                        <p className='px-3 hidden lg:block'>Settings</p>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default Sidebar