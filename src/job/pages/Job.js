import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import ActionButton from '../components/ActionButton'
import JobHeader from '../components/JobHeader'
import test_image from '../../assets/test_image.jpg'
import JobTests from '../components/JobTests'
import Search from '../../shared/components/Navigation/Search'
import CompleteJobModal from '../components/modals/CompleteJobModal'
import DeleteJobModal from '../components/modals/DeleteJobModal'
import EditJobModal from '../../shared/components/NewJob/EditJobModal'

import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Job = () => {

    let id = useParams()
    const navigate = useNavigate(); 


    //const [loading, setLoading] = useState(true)
    const [jobInfo, setJobInfo] = useState(); 
    const [jobNotes, setJobNotes] = useState(); 
    const [jobTests, setjobTests] = useState();     
    const [statusModal, setStatusModal] = useState(false); 
    const [editJobModal, setEditJobModal] = useState(false); 
    const [deleteJobModal, setDeleteJobModal] = useState(false); 
    const [reports, setReports] = useState() 

    useEffect(() => {
        async function getJobInfoData(){
            await window.api.getJobInfo(id.jobNum).then((data) => {
                setJobInfo(data);
            }); 
        }
        async function getTestData(){
            await window.api.getTests(id.jobNum).then((tests) =>{
                setjobTests(tests)       
            })
        }
        async function scanReportsFolder(){
            await window.api.scanReportsFolder(id.jobNum).then((reports) => {
                setReports(reports)
            })
        }
        async function getJobNotes(){
            await window.api.getJobNotes(id.jobNum).then((notes) => {
                if(notes){
                    setJobNotes(notes.note)
                }
            })
        }

        async function temp(){
            await window.api.temp().then(() => {
                console.log('done')
            }); 
        }
        
        getJobInfoData()
        getTestData();
        scanReportsFolder(); 
        getJobNotes();
        temp();
    }, [id])

    const openPDF = async (report) => {
        await window.api.openPDF(id.jobNum, report)
    }

    const updateNotes = async (event) => {
        setJobNotes(event.target.value)
        await window.api.updateNotes(id.jobNum, jobNotes)
    }

    const cancelDeleteJob = () => setDeleteJobModal(false); 
    const confirmDeleteJob = async () => {
        await window.api.deleteJob(id.jobNum).then(() => {
            setDeleteJobModal(false); 
            navigate('/')
        })
    }

    const cancelStatusModal = () => setStatusModal(false);
    const confirmStatusModal = async (status) => {
        await window.api.setJobStatus(id.jobNum, status).then(() => {        
            setStatusModal(false)
        })            
        await window.api.getJobInfo(id.jobNum).then((data) => {
                setJobInfo(data);
        }); 
    }

    return (
        <React.Fragment> 
            <DeleteJobModal 
                deleteJobModal={deleteJobModal}
                setDeleteJobModal={setDeleteJobModal}
                cancelDeleteJob={cancelDeleteJob}
                confirmDeleteJob={confirmDeleteJob}
            /> 

            {/* need to load the tests and update afterwords*/}
            {jobInfo && <EditJobModal  
                show={editJobModal}
                setCreateNewJob={setEditJobModal}
                jobInfo={jobInfo}
                jobTests={jobTests}
                notes={jobNotes}
                //cancelUpdate={cancelCreateNewJob}
                //confirmUpdate={confirmCreateNewJob}
            /> }

            <CompleteJobModal 
                statusModal={statusModal}
                cancelStatusModal={cancelStatusModal}
                confirmStatusModal={confirmStatusModal}
                setStatusModal={setStatusModal}
                jobInfo={jobInfo}
            /> 

            <div 
                className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
            >     
                {<div className=' bg-red-100 flex flex-col'>

                        <Search />
                        
                        <div className='flex bg-zinc-100 p-2 justify-between  flex-col xl:flex-row'>
                            <JobHeader jobInfo={jobInfo} jobNum={id.jobNum}  />
                            
                            <div className='flex h-12 space-x-1 p-2 '>
                                {jobInfo && (jobInfo.status === 0?  
                                    <ActionButton
                                        className={'hover:bg-emerald-500'}
                                        onClick={() => {setStatusModal(true)}}
                                        content={"Complete Job"}
                                    />
                                    :<ActionButton
                                        className={'hover:bg-blue-400'}
                                        onClick={() => {setStatusModal(true)}}
                                        content={"Reset Job"}
                                    />)
                                }

                                <ActionButton
                                    className={'hover:bg-blue-400'}
                                    onClick={() => {setEditJobModal(true)}} 
                                    content={"Edit Job"}
                                />

                                <ActionButton 
                                    className='hover:bg-red-400'
                                    onClick={() => {setDeleteJobModal(true)}}
                                    content={"Delete Job"}
                                >
                                </ActionButton>
                            </div>
        
                        </div>
                    
                </div>} 

                <div className='h-5/6 grid grid-rows-3 grid-cols-6 gap-1 p-2'>
                    <div className='row-span-2 col-span-4 p-2 border-b-2'>
                        <h2 className='py-2'>Comments</h2>
                        <textarea 
                            className='p-2 w-full h-5/6 resize-none bg-zinc-100 border-2 '
                            placeholder='Enter Comments' 
                            value={jobNotes}
                            onChange={updateNotes}
                        />
                        
                    </div>
                    <div className='row-span-3 col-span-2 bg-zinc-100 flex flex-col items-center'>
                        <h1 className='images w-full text-center p-3 bg-white'>
                            Images
                        </h1> 
                        <div className='overflow-y-auto w-full p-2'>                        
                            <div className='bg-white my-2 p-1'>
                                <img src={test_image} classname='object-none h-48 w-96'  alt='weed'/>
                                <p className='text-center p-2'>W12913</p>
                            </div>
                            <div className='bg-white my-2'>
                                <img src={test_image} classname='' alt='weed'/>
                                <p className='text-center py-2'>W12913</p>
                            </div>
                            <div className='bg-white my-2'>
                                <img src={test_image} classname='' alt='weed'/>
                                <p className='text-center py-2'>W12913</p>
                            </div>
                        </div>

                        
                    </div>
                    <div className='row-span-1 col-span-2 border-2 overflow-y-auto'>
                        {jobTests && 
                            <JobTests
                                testInfo={jobTests}
                                jobId={id.jobNum}
                            />
                        }
                    </div>
                    <div className='row-span-1 col-span-2 grid space-y-2 text-center'>
                        <div className='[&>*]:p-1 border-1' >
                            <h1 className='text-lg bg-emerald-700 text-white'>Reports</h1>
                            {reports ? 
                                reports.map((report) => {
                                    return (
                                        <div className='flex justify-between space-x-2'>
                                            <div className='text-blue-500 flex space-x-1'>
                                                <DescriptionIcon />
                                                <p className='font-2xl'>{report}</p> 
                                            </div>
                                            <div className='flex'>
                                                <button className='text-sm text-gray-500 border-1  rounded-md flex px-2 items-center' onClick={() => openPDF(report)}>
                                                    <VisibilityIcon className='p-1' /> 
                                                    <p>View</p> 
                                                </button>
                                                <button className='text-sm text-gray-500 border-1 rounded-md flex px-2 items-center'>
                                                    <EditIcon className='p-1' /> 
                                                    <p>Edit</p> 
                                                </button>    
                                            </div>
                                        </div>
                                    )
                                }): <p>No scanned reports found.</p>
                            }
                            
                        </div>

                        <div className='[&>*]:p-1 border-1 content-center'>
                            <h1 className='text-lg bg-emerald-700 text-white'>Client Good Copies</h1>
                            <p>(Complete Jobs Only)</p>
                            <p>No scanned copies found.</p>
                            {/*.*1384.pdf regex example */}
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Job