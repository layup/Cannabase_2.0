import React from 'react'

const JobHeader = ({jobInfo, jobNum, status }) => {

  return (
        <div className='flex space-x-1 '>
            <div className='p-2 '>
                <p><span className=''>Job ID:</span> W{jobNum} </p>
                <p className=''>Client: {jobInfo && <span className={`text-blue-500 ${jobInfo.client_name.length > 35 && 'text-sm'}`}>{jobInfo.client_name}</span>} </p>
            </div>

            <div className='p-2'>
                <p>Recieve Date: {jobInfo && jobInfo.receive_date}</p>
                <p>Complete Date: {jobInfo && jobInfo.complete_date ? jobInfo.complete_date: "N/A"}</p>
            </div> 
            
            <p className='p-2'>Status: 
                {jobInfo && (jobInfo.status === 1 ? 
                    <span className='text-emerald-400 uppercase'> Complete</span>
                    :<span className='text-red-400 uppercase'> Incomplete</span> )                   
                }

            </p>         
        
        </div>
  )
}

export default JobHeader