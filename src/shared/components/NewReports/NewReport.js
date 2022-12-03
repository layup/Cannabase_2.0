import React, { useState, useRef, useEffect } from 'react'

import Modal from '../UIElements/Modal'

import MushroomReport from './MushroomReport';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import Close from '@mui/icons-material/Close';

const NewReport = (props) => {

    const [selectReport, setSelectReport] = useState(""); 
    const [file, setFile ] = useState("");
    const [next, setNext] = useState(false)

    const errors = useRef({
        selectReport:'', 
        file:'', 
    })

    const nextStage = () => {

        if(selectReport){
            errors.current.selectReport = "Please Select a report "
             
        }else {
            errors.current.selectReport = ""
        }
    
          //deal with clientName validation 
        if(file){
            errors.current.file = "Please select a .xlsx file "
            
        }else {
            errors.current.file = ""
        }

        if(errors.current.selectReport || errors.current.file){
            console.log(errors.current)
            return 
        }
        console.log("pass")
    }

    const handleCancel = () => {
        setSelectReport("")
        setFile("")

        errors.current = {
            selectReport:'', 
            file:'',
        }
  
        props.cancelCreateNewReport() 
      }
  
    const openFileXlsx = async () => {
        console.log('running tests')
        await window.api.openFileXlsx().then((value) => {
            console.log('done:', value)
        });
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
                                checked={selectReport === 'mushroom'}
                                onChange={() => setSelectReport('mushroom')}
                            />
                            <labe>Pesticides/Toxins Batch</labe>
                        </div>
                    </div>
                </div>

            
                <div className='my-2'>
                    <h1 className='text-lg'>Attach Document</h1>
                    <div className='border-2 border-dashed p-24 flex flex-col items-center font-medium border-zinc-300'> 
                        <FileUploadIcon className='text-xl'/> 
                        <p>Drag or Drop Here </p>
                        <p>or</p>
                        <button
                            className='text-blue-700'
                            onClick={openFileXlsx}
                        >
                            Browse File
                        </button>
                    </div>
                    <p className=''>Accepted File Types: .xlsx</p>
                </div>

            </div>
        </Modal>
    )
}

export default NewReport