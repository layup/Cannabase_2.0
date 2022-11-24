import React from 'react'

import {Link} from 'react-router-dom';

import { testToString } from '../../../utils/utils'

const TableContent = (props) => {
    return (
        <tr className='border-b-1 border-zinc-200 [&>td]:p-2 hover:bg-yellow-100 overflow-x-auto ' key={props.key}>
            <td>
                <Link to={`/jobs/${props.jobNum}`} className='text-blue-500 hover:underline'>W{props.jobNum}</Link>
            </td>
            <td className='text-left'>
                {testToString(props.test)}
            </td>
            <td className='text-left'>
                {props.company}
            </td>
            <td className='flex justify-center items-center '>
                {props.status === 0 && 
                    <div className='w-32 md:px-3  bg-red-200 rounded-lg '>
                        <p className=' rounded-lg text-red-800 font-medium uppercase text-xs md:text-sm'>Incomplete</p>
                    </div>
                }
                {props.status === 1 && 
                    <div className='w-32 px-3  bg-emerald-200 rounded-lg '>
                        <p className=' rounded-lg text-emerald-800 font-medium uppercase text-sm'>Complete</p>
                    </div>
                }
                {props.status === 2 && 
                    <div className='w-32 px-3 bg-yellow-200 rounded-lg '>
                        <p className=' rounded-lg text-yellow-800 font-medium uppercase text-sm'>Inprogress</p>
                    </div>
                }
            </td>
            <td>
                {props.receive_date}
            </td>
            <td>
                {props.complete_date ? (props.complete_date): ("N/A") }
            </td>
        </tr>
    )
}

export default TableContent