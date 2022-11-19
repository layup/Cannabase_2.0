import React, { useEffect, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import WindowIcon from '@mui/icons-material/Window';
import WorkIcon from '@mui/icons-material/Work';
import ArchiveIcon from '@mui/icons-material/Archive';
import StorageIcon from '@mui/icons-material/Storage';


import logo from '../../../assets/logo.png'
import NewButton from './NewButton';
import SidebarLink from './SidebarLink';
import Modal from '../UIElements/Modal';
import Backdrop from '../UIElements/Backdrop';
import Close from '@mui/icons-material/Close';



function Sidebar() {

    let location = useLocation(); 

    const [createNewJob, setCreateNewJob] = useState(false)

    const cancelCreateNewJob = () => setCreateNewJob(false);
    const confirmCreateNewJob = () => setCreateNewJob(false); 


    return (
        <React.Fragment>

            <Modal
                show={createNewJob}
                onCancel={cancelCreateNewJob}
                className="w-1/2 left-1/4"
                header={
                    <div className='flex justify-between px-4 '>
                        <h2 className='text-lg font-semibold'>Create New Job</h2>
                        <button onClick={cancelCreateNewJob}>                        
                            <Close />
                        </button>

                    </div>
                }

                footer={
                    <div className='p-2 bg-zinc-200 space-x-2 rounded-b-md w-full text-right px-4'>
                        <button 
                            className='rounded-md border-1 border-zinc-400 p-2'
                            onClick={cancelCreateNewJob}
                        >
                            Cancel
                        </button>
                        <button className="bg-blue-600 text-white p-2 rounded-md" onClick={confirmCreateNewJob}>Create New Job</button>
                    </div>
                }
            >
                <div className='p-4  flex  w-full border-t-1 border-zinc-200'>
                    <div className='w-full p-2 space-y-1 [&>h2]:font-medium'>
                        <h2>Job Number</h2>
                        <input className="w-full p-1 border-2 border-zinc-200 rounded-md" type='text' placeholder="Job number"/>
                        <h2>Client</h2>
                        <input className="w-full p-1 border-2 border-zinc-200 rounded-md" type='text' placeholder="Select Client"/>
                        <h2>Requested Tests</h2>
                        <div className='flex space-x-10'>
                            <div className='p-1 flex flex-col space-y-1'>
                                <h3 className='text-sm'>Health Cananda Cannabis Test</h3>
                                <label className='space-x-1'>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Micro A"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Metals"}</span>
                                </label>    
                                <label className='space-x-1'>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Basic Potency"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Deluxe Potenxy"}</span>
                                </label>    
                                <label className='space-x-1'>
                                <input type="checkbox" value={1}/>
                                <span>{"Aflotoxins"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Pesticides"}</span>
                                </label>    
                                <label className='space-x-1'>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Micro B"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Terpenes"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Solvents"}</span>
                                </label>    
                            </div>
                            <div className='flex flex-col p-1 space-y-1'>
                                <h3 className='text-sm'>Other</h3>
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Other"}</span>
                                </label>    
                                <label className='space-x-1'>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Fungal ID"}</span>
                                </label>    
                                <label className='space-x-1 '>
                                    <input type="checkbox" value={1}/>
                                    <span>{"Psilocybin"}</span>
                                </label>  
                            </div>
                        </div>

                    </div>
                    <div className=' w-full p-2'>
                        <p>Job Notes</p>
                        <textarea className='w-full max-h-96 min-h-20 rounded-md border-2 border-zinc-200 h-96 p-2'/>
                    </div>

                </div>
            </Modal>

            <div className='fixed top-0 left-0 w-full h-16 md:w-16 lg:w-56 md:h-full md:border-r-1 md:border-zinc-300'>
                <div className='bg-white h-full lg:py-4 flex flex-row justify-around md:justify-start md:flex-col items-center md:items-stretch drop-shadow-lg  '>
                    <div className='hidden lg:flex justify-center pt-2 pb-10 items-center'>
                        <img src={logo} className="w-12 h-12" alt="logo" /> 
                        <p className=' text-2xl text-center font-medium text-emerald-700' >Cannabase</p>
                    
                    </div>
                    <div className='md:pt-10 py-2 lg:py-4 hidden lg:flex lg:flex-col  place-items-center m-2 gap-2'>
                        <NewButton text="New Job" onClick={() => setCreateNewJob(true)}/> 
                        <NewButton text="New Report"  /> 
                    </div>

                    <div className={`flex md:flex-col justify-between`}>
                        <SidebarLink
                            name="Dashboard"
                            location={"/"}
                            subLocation={"/"}
                            icon={<WindowIcon />}
                        />

                        <SidebarLink
                            name="Clients"
                            location={"/clients"}
                            subLocation={"/clients/:clientId"}
                            icon={<StorageIcon />}
                        />
                            

                        <SidebarLink
                            name="Jobs"
                            location={"/jobs"}
                            subLocation={"/jobs/:jobId"}
                            icon={<WorkIcon />}
                        />

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
        </React.Fragment>
    )
}

export default Sidebar