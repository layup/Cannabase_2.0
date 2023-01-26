import React from 'react'

const ClientInfoItem = ({title, clientInfo, keyName, onChange}) => {

    return (
        <tr className=' text-left border-y-1'>
        <th scope="row" className='font-medium p-2 text-xs'>
            {title}
        </th>
        {clientInfo && Object.keys(clientInfo).map((jobNum) => {

            return (
                <td className=' p-1' key={jobNum}>
                    <input 
                        value={clientInfo[jobNum][keyName]} 
                        onChange={(e) => onChange(jobNum, keyName, e.target.value)}
                        className="text-xs p-1 w-11/12 bg-zinc-200 rounded-md"
                    />
                </td>
            )})
        }                
    </tr>
    )
}

export default ClientInfoItem