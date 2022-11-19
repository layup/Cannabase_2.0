import React, {useEffect, useState} from 'react'

import SearchIcon from '@mui/icons-material/Search';

const Clients = () => {

    const [clientData, setClient] = useState([]); 

    const [bestMatches, setBestMatches] = useState([])

    const clear = () => {
        setClient(""); 
        setBestMatches([]); 
    }

    useEffect(() => {
        async function getClientData(){
            await window.api.getAllClients().then((value) => {
                setClient(value);
    
  
            }); 

        }
        getClientData()
        console.log(clientData)
    }, [])


    return (
        <div 
            className=' flex flex-col h-screen max-w-screen  lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >  
            <div className='bg-emerald-700 p-4 flex'>
                <div className='p-2 bg-emerald-800'>
                    <SearchIcon className='text-white bg-emerald-800'/>
                </div>

                <input 
                    type='search' 
                    placeholder='Search Job Number' 
                    className='w-full p-1 bg-emerald-800 text-white border-transparent focus:border-transparent focus:ring-0 outline-none'
                />
            </div>

            <div className='bg-zinc-200 p-2 py-10'>
                <p>total clients: {clientData.length}</p>
            
            </div>

            <div className='w-full h-full bg-white overflow-y-auto '>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base h-full'> 
                    <thead className='bg-emerald-700 sticky top-0'>
                        <tr className='text-white [&>th]:font-normal [&>th]:p-2 '>
                            <th className='w-10/12 '>Client Names</th>
                            <th className='w-1/12'>Total Jobs</th>
                            <th className='w-1/12'>Active Jobs</th>
                        </tr>
                    </thead>
                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {clientData && clientData.map((item) => {
                            return (
                                <tr className='border-1 hover:bg-yellow-200'>
                                    <td className='py-2 px-3 text-left '>{item.client_name}</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                </tr>
                            )
                        })}
                    </tbody>          
                </table>
            </div>

            <div className='bg-emerald-700 p-2 text-white flex space-x-2'>
                <p>All</p>
                <p>#</p>
                <p>A</p>
                <p>B</p>
            </div>

        </div>
    )
}

export default Clients