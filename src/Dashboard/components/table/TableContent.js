import React, { useEffect, useState } from 'react'


const TableContent = (props) => {


    return (
        <tr className='border-b-1 border-zinc-200 [&>td]:p-2 hover:bg-gray-100  '>
            <td>
                <a href='/' className='text-blue-500 hover:underline'>{props.jobNum}</a>
            </td>
            <td className='text-left'>
                {props.test}
            </td>
            <td>
                {props.company}
            </td>
            <td className='flex justify-center items-center '>
                {props.status === 0 && 
                    <div className='w-32 px-3  bg-red-200 rounded-lg '>
                        <p className=' rounded-lg text-red-800 font-medium uppercase text-sm'>Incomplete</p>
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
                {props.subDate}
            </td>
            <td>
                {props.comDate ? (props.comDate): ("N/A") }
            </td>
        </tr>
    )
}

export default TableContent