import React, { useEffect, useState } from 'react'
import { matchString } from '../../utils/utils'

const JobItem = (props) => {

    const [JobComplete, setJobComplete] = useState(); 
    const [CompleteDate, setCompleteDate] = useState()
    

    useEffect(() => {
        if(props.testStatus === 1){
            setJobComplete(true)
            setCompleteDate(props.completeDate)
        }else{
            setJobComplete(false)
        }

    }, [])

    const completeTests = async () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
    
        today = yyyy + '-' + mm + '-' + dd;


        await window.api.setTestsStatus(props.jobId, props.testType, 1).then(() => {
        
            setCompleteDate(today)
            setJobComplete(true)
            console.log("ran completeTest")
        })

    }

    const resetTests = async () => {
        setJobComplete(false)
        await window.api.setTestsStatus(props.jobId, props.testType, 0).then(() => {

            setJobComplete(false)
            console.log('ran resetTest')

        }); 
    }

    return (
        <tr className='border-b-1 border-zinc-200 [&>td]:px-2'>
            <td className=''>
                {JobComplete  ? 
                    <button 
                        className=' p-1  rounded-lg w-full uppercase border-1 border-red-700 text-red-700 text-sm hover:bg-red-700 hover:text-white '
                        onClick={resetTests}
                    >
                        Reset
                    </button>
                    :<button 
                        className=' p-1  rounded-lg w-full uppercase border-1 border-black text-sm hover:bg-emerald-700 hover:text-white hover:border-emerald-600'
                        onClick={completeTests}
                    >
                        Complete
                    </button>

                } 
            </td>
            <td className='p-2'>{matchString(props.testType)}</td>
            <td>
                {JobComplete ? <p>{CompleteDate} </p>: <p>N/A</p>}
            </td>
        </tr>
    )
}

export default JobItem