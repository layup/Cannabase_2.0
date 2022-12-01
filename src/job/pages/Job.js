import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import JobItem from '../components/JobItem'
import test_image from '../../assets/test_image.jpg'
import JobTests from '../components/JobTests'
import Search from '../../shared/components/Navigation/Search'
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Modal from '../../shared/components/UIElements/Modal'

const Job = () => {

    let id = useParams()

    const navigate = useNavigate(); 

    //const [loading, setLoading] = useState(true)
    const [jobStatus, setJobStatus] = useState(); 
    const [jobInfo, setJobInfo] = useState(); 
    const [jobNotes, setJobNotes] = useState(); 
    const [testInfo, setTestInfo] = useState(); 
    const [searchInput, setSearchInput] = useState(''); 
    const [deleteJobModal, setDeleteJobModal] = useState(false); 
    const [completeJobModal, setCompleteJobModal] = useState(false); 
    const [reports, setReports] = useState([]) //edit so can map multiple reports 

    //TODO set the job status 
    useEffect(() => {
        async function getJobInfoData(){
            await window.api.getJobInfo(id.jobNum).then((data) => {
                setJobInfo(data);
            }); 
        }
        async function getTestData(){
            await window.api.getTests(id.jobNum).then((tests) =>{
                setTestInfo(tests)       
            })
        }

        async function scanReportsFolder(){
            await window.api.scanReportsFolder(id.jobNum).then((reports) => {
                setReports(reports)
                //console.log({reports})
               
            })
        }
        async function getJobNotes(){
            await window.api.getJobNotes(id.jobNum).then((notes) => {
                if(notes){
                    setJobNotes(notes.note)
                }
               
            })
        }

        getJobInfoData()
        getTestData();
        scanReportsFolder(); 
        getJobNotes();
    }, [id])

    const openPDF = async (report) => {
        //console.log('report:', report)
        await window.api.openPDF(id.jobNum, report)
    }

    const updateNotes = async (event) => {
        setJobNotes(event.target.value)
        //console.log(jobNotes)
        await window.api.updateNotes(id.jobNum, jobNotes)
    }

    const cancelDeleteJob = () => setDeleteJobModal(false); 
    const confirmDeleteJob = async () => {
        await window.api.deleteJob(id.jobNum).then(() => {
            setDeleteJobModal(false); 
            navigate('/')
        })
    }

    const cancelCompleteJob = () => setCompleteJobModal(false);
    const confirmCompleteJob = () => setCompleteJobModal(false); 

    return (
        <React.Fragment> 

            <Modal 
                show={deleteJobModal}
                onCancel={cancelDeleteJob}
                header="Delete Job?"
                className='w-1/3 left-1/3'
                footer={
                    <div className='bg-zinc-200 p-2 rounded-b-md space-x-4 text-right w-full' >
                        <button onClick={cancelDeleteJob}>cancel</button>
                        <button className='bg-red-400 text-white p-1 px-2 rounded-md'onClick={confirmDeleteJob}>Delete</button>
                    </div>
                }
            > 
                <div className='text-center p-4 text-lg w-full '>
                    <p>Are you sure you want to delete job?</p>
                    <p>You cannot undo this action</p>
                </div>
            </Modal>

            <Modal 
                show={completeJobModal}
                onCancel={cancelCompleteJob}
                header="Delete Job?"
                className='w-1/3 left-1/3'
                footer={
                    <div className='bg-zinc-200 p-2 rounded-b-md space-x-4 text-right w-full' >
                        <button onClick={confirmCompleteJob}>cancel</button>
                        <button className='bg-emerald-600 text-white p-1 px-2 rounded-md'onClick={confirmDeleteJob}>Confirm</button>
                    </div>
                }
            > 
                <div className='text-center p-4 text-lg w-full'>
                    <p>Are you sure you want to mark the job as complete?</p>
                    <p></p>
                </div>
            </Modal>

            <div 
                className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
            >     
                {<div className=' bg-red-100 flex flex-col'>

                        <Search />
                        
                        <div className='flex bg-zinc-100 p-2 justify-between items-center flex-col xl:flex-row'>
                            <div className='flex space-x-2'>
                                <div className='p-2'>
                                    <p><span className=''>Job ID:</span> W{id.jobNum} </p>
                                    <p className=''>Client: {jobInfo && <span className='text-blue-500'>{jobInfo.client_name}</span>} </p>
                                </div>

                                <div className='p-2'>
                                    <p>Recieve Date: {jobInfo && jobInfo.receive_date}</p>
                                    <p>Complete Date: N/A</p>
                                </div> 
                                
                                <p className='p-2'>Status: 
                                    <span className='text-red-400 uppercase'> Incomplete</span>
                                </p>         
                            
                            </div>
                            
                            <div className='space-x-2 p-2'>
                                <button 
                                    className=' p-2 w-36 rounded-lg border-1 border-zinc-500 text-black bg-white  uppercase text-sm hover:bg-emerald-500 hover:text-white' 
                                    onClick={() => {setCompleteJobModal((true))}}
                                >
                                    Complete Job
                                </button>

                                <button 
                                    className=' p-2 w-36 rounded-lg border-1 border-zinc-500 text-black bg-white  uppercase text-sm hover:bg-blue-400 hover:text-white'
                                >
                                    Edit Job
                                </button>


                                <button 
                                    className=' p-2 w-36 rounded-lg border-1 border-zinc-500 text-black bg-white uppercase text-sm hover:bg-red-400 hover:text-white'
                                    onClick={() => {setDeleteJobModal(true)}}
                                >
                                    Delete Job
                                </button>
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
                    <div className='row-span-3 col-span-2 bg-zinc-100 flex flex-col items-center overflow-y-auto '>
                        <h1 className='images w-full text-center sticky top-0 p-3 bg-white'>
                            Images
                        </h1> 
                        <div className='bg-white my-2'>
                            <img src={test_image} classname='' alt='weed'/>
                        <p className='text-center py-2'>W12913</p>
                        </div>
                        <div className='bg-white my-2 '>
                            <img src={test_image} classname='' alt='weed'/>
                            <p className='text-center py-2'>W12913</p>
                        </div>
                        <div className='bg-white my-2 '>
                            <img src={test_image} classname='' alt='weed'/>
                            <p className='text-center py-2'>W12913</p>
                        </div>
                        
                    </div>
                    <div className='row-span-1 col-span-2 border-2 overflow-y-auto'>
                        {testInfo && 
                            <JobTests
                                testInfo={testInfo}
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
                                        <div className='flex justify-between space-x-2 hover:bg-gray-200'>
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