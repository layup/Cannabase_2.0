import React, { useState } from 'react'

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const TableHeader = () => {

    const [StatusSort, SetStatusSort] = useState(0)
    const [SubmissionDateSort, SetSubmissionDateSort] = useState(0)
    const [CompleteDateSort, SetCompleteDateSort] = useState(0)


    return (
        <thead className='bg-emerald-700'>
            <tr className='text-white [&>th]:font-normal [&>th]:p-2'>
                <th className='rounded-tl-lg w-1/12 '>Job Number</th>
                <th className='w-3/12'>Tests</th>                            
                <th className='w-1/12'>Client</th>
                <th className='w-1/12'>Status</th>
                <th className='w-1/12'>Submission Date</th>
                <th className='w-1/12'>Complete Date</th>
            </tr>
        </thead>
    )
}

export default TableHeader