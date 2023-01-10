import React from 'react'

import JobItem from './JobItem'

const JobTests = (props) => {
    return (
        <table className='w-full'> 
            <thead className='table-auto md:table-fixed bg-emerald-700 w-full sticky top-0'>
                <tr className='text-white [&>th]:text-base [&>th]:font-normal [&>th]:py-2 [&>th]:p-1'>
                    <th className='w-2/6'>Mark As Complete</th>
                    <th className='w-2/6'>Tests</th>
                    <th className='w-2/6'>Complete Date</th>
                </tr>
            </thead>

            <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                {props.testInfo.map((test) => {
                    return (
                        <JobItem
                            key={test.jobId}
                            testType={test.test_type}
                            testStatus={test.status}
                            completeDate={test.complete_date}
                            jobId={props.jobId}
                        />
                    )
                })}
            </tbody>
        </table>
    )
}

export default JobTests