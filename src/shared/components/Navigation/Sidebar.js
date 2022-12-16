import React, { useEffect, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';

import WindowIcon from '@mui/icons-material/Window';
import WorkIcon from '@mui/icons-material/Work';
import ArchiveIcon from '@mui/icons-material/Archive';
import StorageIcon from '@mui/icons-material/Storage';
import ArticleIcon from '@mui/icons-material/Article';

import logo from '../../../assets/logo.png'
import NewButton from './NewButton';
import SidebarLink from './SidebarLink';
import NewJobModal from '../NewJob/NewJobModal';
import NewReport from '../NewReports/NewReport';


function Sidebar() {

    //let location = useLocation(); 

    const [createNewJob, setCreateNewJob] = useState(false)
    const [createNewReport, setCreateNewReport] = useState(false)

    const cancelCreateNewJob = () => setCreateNewJob(false);
    const confirmCreateNewJob = (JobID ,clientName ,jobNote ,tests) => {
        setCreateNewJob(false); 
    }

    const cancelCreateNewReport = () => setCreateNewReport(false); 

    return (
        <React.Fragment>

           <NewJobModal 
            createNewJob={createNewJob}
            setCreateNewJob={setCreateNewJob}
            cancelCreateNewJob={cancelCreateNewJob}
            confirmCreateNewJob={confirmCreateNewJob}
           /> 

           <NewReport 
            createNewReport={createNewReport}
            setCreateNewReport={setCreateNewReport}
            cancelCreateNewReport={cancelCreateNewReport}
           /> 

            <div className='fixed top-0 left-0 w-full h-16 md:w-16 lg:w-56 md:h-full md:border-r-1 md:border-zinc-300'>
                <div className='bg-white h-full lg:py-4 flex flex-row justify-around md:justify-start md:flex-col items-center md:items-stretch drop-shadow-lg  '>
                    <div className='hidden lg:flex justify-center pt-2 pb-10 items-center'>
                        <img src={logo} className="w-12 h-12" alt="logo" /> 
                        <p className=' text-2xl text-center font-medium text-emerald-700' >Cannabase</p>
                    
                    </div>
                    <div className='md:pt-10 py-2 lg:py-4 hidden lg:flex lg:flex-col  place-items-center m-2 gap-2'>
                        <NewButton text="New Job" onClick={() => setCreateNewJob(true)}/> 
                        <NewButton text="New Report" onClick={() => setCreateNewReport(true)} /> 
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
                        <SidebarLink
                            name="Reports"
                            location={"/reports"}
                            subLocation={"/reports/create"}
                            icon={<ArticleIcon />}
                        />


                        <div className=' flex p-4 text-zinc-600'>
                            <ArchiveIcon className=''/>
                            <p className='px-3 hidden lg:block'>Archives</p>
                        </div>

                        <SidebarLink
                            name="Settings"
                            location={"/settings"}
                            subLocation={"/settings"}
                            icon={<SettingsIcon />}
                        />
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Sidebar