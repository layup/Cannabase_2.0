import React, {  useState, useRef } from 'react'
import {useNavigate, redirect} from 'react-router-dom';



import Modal from '../UIElements/Modal'
import Job from '../../../job/pages/Job';
import { convertForDatabase } from '../../utils/utils'

import Close from '@mui/icons-material/Close';
import SelectClient from './SelectClient';

const NewJobModal = ({createNewJob, setCreateNewJob, cancelCreateNewJob, confirmCreateNewJob}) => {
    const tests = [
      "Micro A", 
      "Metals", 
      "Basic Potency", 
      "Deluxe Potenxy", 
      "Toxins",
      "Pesticides",
      "Micro B",
      "Terpenes",
      "Solvents",
    ]
    const otherTests = [
      "Other", 
      "Fungal ID",
      "Psilocybin"
    ]


    const navigate = useNavigate();


    const [testOptions, setTestOptions] = useState(Array(12).fill(false)); 
    const [jobNumber, setJobNumber] = useState("")
    const [clientName, setClientName] = useState("")
    const [jobNotes, setJobNotes] = useState("") 
    const [displayError, setDisplayError] = useState(false)
    const [showClientList, setShowClientList] = useState(false); 
    //const [loading, setLoading] = useState(false)

    const errors = useRef({
      jobNumber:'', 
      clientName:'', 
      tests:''
    })

    const handleJobNumber = event => {
      setJobNumber(event.target.value);
    };

    const handleClientName = event => {
      setClientName(event.target.value);
      setShowClientList(true)
    };
    const handleClientNameList = name => {
      if(name){
        setClientName(name)
      }
      setShowClientList(false)
    }

    const handleClientList = () => {
      setShowClientList(true)
    }

    const handleJobNote = event => {
      setJobNotes(event.target.value)
    }

    const handleTestOptions = (postion) => {
      const updatedTestsOptions = testOptions.map((item, index) => 
        index === postion ? !item : item 
      );

      setTestOptions(updatedTestsOptions)
    }

    const HandleSubmit = async () => {
      //deal with jobnumber validation 
      //check if the job exists already 
      if(jobNumber.length !== 7 ){
        errors.current.jobNumber = "Please Enter a valid Job Number "
         
      }else {
        errors.current.jobNumber = ""
      }

      //deal with clientName validation 
      if(clientName.length < 5){
        errors.current.clientName = "Please Enter a valid Job Number "
         
      }else {
        errors.current.clientName = ""
      }

      //deal with tests validation 
      if(testOptions.includes(true)){
        errors.current.tests = ""
      }else{
        console.log(testOptions)
        errors.current.tests = "Please Enter a valid Job Number "
      }

      if(errors.current.jobNumber || errors.current.clientName || errors.current.tests){
        setDisplayError(true)
        console.log(errors.current)
        return; 
      }      

      setDisplayError(false)

      let tests = convertForDatabase(testOptions)

      await window.api.createNewJob(jobNumber, clientName, tests, jobNotes).then(() => {
        console.log("Submitted")
        handleCancel()
        //should take us to the newly created item \

        navigate(`/jobs/:${jobNumber}`);
      })

    }

    const handleCancel = () => {
      setTestOptions(new Array(12).fill(false))
      setJobNumber("")
      setClientName("")
      setJobNotes("")
      setDisplayError(false)
      setShowClientList(false)

      errors.current = {
        jobNumber: '', 
        clientName: '', 
        tests: ''
      }

      cancelCreateNewJob() 
      
    }


    return (
      <Modal
        show={createNewJob}
        onCancel={handleCancel}
        className="w-7/12 left-1/4"
        header={
            <div className='flex justify-between px-4 border-b-1 border-zinc-200 p-2'>
                <h2 className='text-lg font-semibold'>Create New Job</h2>
                <button onClick={handleCancel}>                        
                    <Close />
                </button>
            </div>
        }

        footer={
            <div className='p-2 bg-zinc-200 space-x-2 rounded-b-md w-full text-right'>
                <button 
                    className='rounded-md border-1 border-zinc-400 p-2'
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button className="bg-blue-600 text-white p-2 rounded-md " onClick={HandleSubmit} >
                  Create New Job
                </button>  
            </div>
        }
    >
      {displayError && 
        <div className="w-sreen bg-red-400 mx-5 my-2 text-center p-3 text-white border-l-4 border-red-700 flex justify-between">
          <p>Please try again.</p>
          <button onClick={() => setDisplayError(false)}>
            <Close />
          </button>
        </div> 
      } 
      <div className='p-4 flex w-full'>

          <div className='w-full p-2 space-y-1 [&>h2]:font-medium'>
              <h2>Job Number</h2>
              <input 
                className={`w-full p-1 border-2 border-zinc-200 rounded-md focus:ring-0 outline-none ${errors.jobNumber ? "border-red-400" : null }`} 
                type='text' 
                placeholder="Job number"
                //required="required"
                value={jobNumber}
                onChange={handleJobNumber}
              />
              {errors.current.jobNumber && <p className='text-xs text-red-400'>Please enter a job number</p>} 

              <h2>Client</h2>
              <input 
                className={`w-full p-1 border-2 border-zinc-200 rounded-md focus:ring-0 outline-none ${errors.clientName ? "border-red-400" : null }`} 
                type='text' 
                placeholder="Select Client"
                value={clientName}
                onChange={handleClientName}
                onClick={handleClientList}
              />
              {showClientList && <SelectClient clientName={clientName} handleClientNameList={handleClientNameList} />}
              {errors.current.clientName && <p className='text-xs text-red-400'>Please enter a client Name</p>} 

              <h2>Requested Tests</h2>
              <div className='flex space-x-10'>
                  <div className='p-1 flex flex-col space-y-1'>
                      <h3 className='text-sm '>Health Cananda Cannabis Test</h3>
                      <ul className="space-y-1">
                        {tests.map((name, index) => {
                          return (
                            <li key={index}>
                              <div className='space-x-1'>
                                <input 
                                  type="checkbox"
                                  name={name}
                                  value={name}
                                  checked={handleTestOptions[index]}
                                  onChange={() => handleTestOptions(index)}
                                />
                                <label>{name}</label>
                              </div>
                            </li>
                          )
                        })} 
                      </ul>
                  </div>
                  <div className='flex flex-col p-1'>
                      <h3 className='text-sm '>Other</h3>
                      <ul className='space-y-1'>
                        {otherTests.map((name, index) => {
                          return (
                            <li key={index}>
                              <div className='space-x-1'>
                                <input 
                                  type="checkbox"
                                  name={name}
                                  value={name}
                                  checked={handleTestOptions[index]}
                                  onChange={() => handleTestOptions(index+9)}
                                />
                                <label>{name}</label>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                  </div>
              </div>
              {errors.current.tests && <p className='text-xs text-red-400'>Please select a tests</p>} 

          </div>
          <div className=' w-full p-2'>
              <p>Job Notes</p>
              <textarea 
                className='w-full max-h-96 min-h-20 rounded-md border-2 border-zinc-200 h-96 p-2'
                value={jobNotes}
                onChange={handleJobNote}
              />
          </div>

      </div>
    </Modal>
    )
}

export default NewJobModal