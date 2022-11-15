import React, {useEffect, useState} from 'react'

const Clients = () => {

    const [clientData, setClient] = useState([]); 


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
            className='bg-zinc-300 flex flex-col h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >  
            <div className='w-full h-full bg-white overflow-y-auto'>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base h-full'> 
                    <thead className='bg-emerald-700 sticky top-0'>
                        <tr className='text-white [&>th]:font-normal [&>th]:p-2 '>
                            <th className='rounded-tl-lg w-1/12 '>Client Names</th>
                        </tr>
                    </thead>
                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {clientData && clientData.map((item) => {
                            return (
                                <tr>
                                    <td>{item.client_name}</td>
                                </tr>
                            )
                        })}
                    </tbody>          
                </table>
            </div>

        </div>
    )
}

export default Clients