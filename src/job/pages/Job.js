import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'

import JobItem from '../components/JobItem'
import test_image from '../../assets/test_image.jpg'
import JobTests from '../components/JobTests'
import Search from '../../shared/components/Navigation/Search'

import Modal from '../../shared/components/UIElements/Modal'

const Job = () => {

    let id = useParams()

    //const [loading, setLoading] = useState(true)
    const [jobStatus, setJobStatus] = useState(); 
    const [jobInfo, setJobInfo] = useState(); 
    const [testInfo, setTestInfo] = useState(); 
    const [searchInput, setSearchInput] = useState(''); 
    const [deleteJob, setDeleteJob] = useState(false); 
    const [completeJob, setCompleteJob] = useState(false); 


    //TODO set the job status 
    useEffect(() => {
        async function getJobInfoData(){
            await window.api.getJobInfo(id.jobNum).then((value) => {
                setJobInfo(value);
            }); 
        }
        async function getTestData(){
            await window.api.getTests(id.jobNum).then((value) =>{
                setTestInfo(value)       
            })
        }

        getJobInfoData()
        getTestData();
    }, [id])


    const cancelDeleteJob = () => setDeleteJob(false); 
    const confirmDeleteJob = () => setDeleteJob(false); 

    return (
        <React.Fragment> 

            <Modal 
                show={deleteJob}
                onCancel={cancelDeleteJob}
                header="Delete Job?"
                className='w-1/4 left-1/3'
                footer={
                    <div className='bg-zinc-200 p-2 rounded-b-md space-x-4 text-right w-full' >
                        <button onClick={cancelDeleteJob}>cancel</button>
                        <button className='bg-red-400 text-white p-1 px-2 rounded-md'onClick={confirmDeleteJob}>Delete</button>
                    </div>
                }
            > 
                <div className='text-center p-4 text-xl'>
                    <p>Are you sure you want to delete job?</p>
                    <p>You cannot undo this action</p>
                </div>
            </Modal>

            <div 
                className='bg-white flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
            >     
                {<div className=' bg-red-100 flex flex-col'>

                        <Search />
                        

                        <div className='flex bg-zinc-100 p-2 justify-between items-center'>
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
                                    className=' p-2 w-36 rounded-lg border-1 border-zinc-500 text-black bg-white  uppercase text-sm hover:bg-emerald-400 hover:text-white'
                                    
                                >
                                    Complete Job
                                </button>
                                <button 
                                    className=' p-2 w-36 rounded-lg border-1 border-zinc-500 text-black bg-white uppercase text-sm hover:bg-red-400 hover:text-white'
                                    onClick={() => {setDeleteJob(true)}}
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
                            <h1 className='text-lg bg-emerald-700 text-white'>Bench Sheets & COCs</h1>
                            <p>No scanned bench sheets found.</p>
                        </div>

                        <div className='[&>*]:p-1 border-1 content-center'>
                            <h1 className='text-lg bg-emerald-700 text-white'>Client Good Copies</h1>
                            <p>No scanned copies found.</p>
                        </div>

                    </div>


                </div>
            </div>
        </React.Fragment>
    )
}

export default Job