import React, { useState, useRef, useEffect } from 'react'

import Modal from '../UIElements/Modal'

import Close from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';


const NewReport = (props) => {

    const navigate = useNavigate()

    const [selectReport, setSelectReport] = useState(""); 
    const [fileName, setFileName ] = useState("");
    const [filePath, setFilePath] = useState(""); 
    const [next, setNext] = useState(false)
    const [displayError, setDisplayError] = useState(false)

    const errors = useRef({
        selectReport:'', 
        file:'', 
    })

    const nextStage = () => {

        if(selectReport){
            errors.current.selectReport = ""
             
        }else {
            errors.current.selectReport = "Please Select a report"
        }
    
        //deal with file Path validation 

        if(fileName){

            
        }else {
            errors.current.file = "Please select a .xlsx file " 
        }

        if(errors.current.selectReport || errors.current.file){
            setDisplayError(true)
            console.log(errors.current)
            return 
        }

        handleCancel()        
        navigate(`/reports/create`, {state: {fileName: fileName, filePath: filePath, selectReport: selectReport}});
    
    }

    const handleCancel = () => {
        setSelectReport("")
        setFileName("")
        setFilePath("")
        setDisplayError(false)

        errors.current = {
            selectReport:'', 
            file:'',
        }
  
        props.cancelCreateNewReport() 
      }
  
    const openFileXlsx = async () => {
        console.log('running tests')
        await window.api.openFileXlsx().then(({validFile, fileName, filePath}) => {
            console.log(validFile)
            if(validFile){
                setFileName(fileName)
                setFilePath(filePath)
                errors.current.file = ''
            }else {
                setDisplayError(true)
                errors.current.file = "Please select a .xlsx file " 
            }
        });
    }


    const removeFile = () => {
        setFileName("")
        setFilePath("")
    }


    return (
        <Modal
            show={props.createNewReport}
            onCancel={props.cancelCreateNewReport}

            className={`${next ? "w-11/12" :"w-6/12 left-1/4"} `}
            header={
                <div className='flex justify-between px-4 border-b-1 border-zinc-200 p-2'>
                    <h2 className='text-lg font-semibold'>Create Report</h2>
                    <button onClick={handleCancel}>                        
                        <Close />
                    </button>
                </div>
        }

        footer={
            <div className='p-2 px-4 bg-zinc-200 space-x-2 rounded-b-md w-full text-right'>
                <button onClick={handleCancel}>Cancel</button> 
                <button className="bg-blue-600 text-white p-2 rounded-md " onClick={nextStage}>
                  Next
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

            <div className='flex flex-col p-2 px-6 w-full'>
                <div>
                    <h1 className='text-lg'>Select Type of Report</h1>
                    <div className=' flex flex-col space-y-1' >
                        <div className='space-x-2'>
                            <input 
                                type="checkbox"
                                className=''
                                name="cannabis"
                                checked={selectReport === 'cannabis'}
                                onChange={() => setSelectReport('cannabis')}
                            />
                            <label>Cannabis Potency Batch</label>
                        </div>

                        <div className='space-x-2'>
                            <input 
                                type="checkbox"
                                className=''
                                checked={selectReport === 'pesticides'}
                                onChange={() => setSelectReport('pesticides')}
                            />
                            <labe>Pesticides/Toxins Batch</labe>
                        </div>
                    </div>
                </div>

                {errors.current.selectReport && <p className='text-xs text-red-400'>Please select a report.</p>}

            
                <div className='my-2'>
                    <h1 className='text-lg'>Attach Document</h1>
                    {fileName ? 
                        (
                            <div className='h-64 flex justify-center items-center border-2 border-dashed'>
                                <p className='font-medium px-20'>{fileName}</p> 
                                <button onClick={removeFile}>
                                    <Close /> 
                                </button>
                            </div>

                        ) : ( 
                            <div className='h-64 border-2 border-dashed flex justify-center items-center space-x-2 font-medium border-zinc-300'
                            
                            >
                                    <p>Select a file </p>
                                    <button
                                        className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow'
                                        onClick={openFileXlsx}
                                    >
                                        Browse...
                                    </button>
                            </div>


                        )
                    }
                    <p className=''>Accepted File Types: .xlsx</p>
                </div>
                

                {errors.current.file && <p className='text-xs text-red-400'>Please select a valid file.</p>}

            </div>
        </Modal>
    )
}

export default NewReport