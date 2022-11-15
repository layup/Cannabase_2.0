import React from 'react'
import {Link} from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import WindowIcon from '@mui/icons-material/Window';
import WorkIcon from '@mui/icons-material/Work';
import ArchiveIcon from '@mui/icons-material/Archive';
import StorageIcon from '@mui/icons-material/Storage';


import logo from '../../../assets/logo.png'
import NewButton from './NewButton';

function Sidebar() {
    return (
        <div className='fixed top-0 left-0 w-full h-16 md:w-16 lg:w-56 md:h-full'>
            <div className='bg-white h-full lg:py-4 flex flex-row justify-around md:justify-start md:flex-col items-center md:items-stretch drop-shadow-md'>
                <div className='hidden lg:flex justify-center pt-2 pb-10 items-center'>
                    <img src={logo} className="w-12 h-12" alt="logo" /> 
                    <p className=' text-2xl text-center font-medium text-emerald-700' >Cannabase</p>
                
                </div>
                <div className='md:pt-10 py-2 lg:py-4 grid place-items-center m-2 gap-2 '>
                    <NewButton text="New Job"/> 
                    <NewButton text="New Client"/> 
                </div>

                <div className='flex md:flex-col justify-between '>
                    <Link className=' flex p-4 text-emerald-600 md:bg-gray-200 pl-4 md:border-r-4 border-emerald-600' to="/">
                        <WindowIcon className=''/>
                        <p className='px-3 hidden lg:block'>Dashboard</p>
                    </Link>

                    <Link className=' flex p-4 text-zinc-600' to="/clients">
                        <WorkIcon className=''/>
                        <p className='px-3 hidden lg:block'>Clients</p>
                    </Link>

                    <Link className=' flex p-4 text-zinc-600' to="/jobs">
                        <WorkIcon className=''/>
                        <p className='px-3 hidden lg:block'>Jobs</p>
                    </Link>

                    <div className=' flex p-4 text-zinc-600' to="/jobs">
                        <WorkIcon className=''/>
                        <p className='px-3 hidden lg:block'>Reports</p>
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