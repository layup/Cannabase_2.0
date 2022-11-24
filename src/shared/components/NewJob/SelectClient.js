import React, { useEffect, useState } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const SelectClient = (props) => {

    const [clientList, setClientList] = useState([])

    useEffect(() => {

        async function searchClient(){
            await window.api.clientSearch(props.clientName).then((clients) => {
                //console.log(props.clientName)
                setClientList(clients)

            })
        }   
        searchClient();

    }, [props.clientName])

    return (
        <div className='bg-neutral-100 absolute top-15 h-fit max-h-56 lg:w-94 2xl:w-128 overflow-y-auto px-2 text-sm rounded'>
            <ul>
                <li 
                    className='p-2 sticky top-0 bg-neutral-100 flex justify-between items-center hover:cursor-pointer hover:bg-neutral-200'
                    onClick={() => {props.handleClientNameList()}}
                >
                    <p>Add New Client </p>
                    <AddCircleOutlineIcon className='p-1'/>  
                </li>
                {clientList && clientList.map((client, index) => {
                    return (
                        <li  
                            className='border-t-1 border-zinc-300 p-2 hover:cursor-pointer hover:bg-neutral-200 '
                            onClick={() => {props.handleClientNameList(client.client_name)}}
                        >
                            {client.client_name}
                        </li>
                    )
                }) }
            </ul>
        </div>
    )
}

export default SelectClient