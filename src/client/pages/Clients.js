import React, {useEffect, useState} from 'react'

import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

import {useNavigate} from 'react-router-dom';

const Clients = () => {
    const alphabet = ['All', "#","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    const [clientData, setClient] = useState([]); 
    const [totalClients, setTotalClients] = useState()
    const [filter, setFilters] = useState('All')

    const navigate = useNavigate();
    

    //const [bestMatches, setBestMatches] = useState([])

    /* 
    const clear = () => {
        setClient(""); 
        setBestMatches([]); 
    } */ 

    useEffect(() => {
        async function getClientData(){
            await window.api.getAllClients().then((value) => {
                setClient(value);
                setTotalClients(value)  
            }); 

        }
        getClientData()
        
    }, [])

    const selectFilter = async (letter) => {
        //console.log(letter)
        setFilters(letter)

        if(letter === 'All'){
            setClient(totalClients)
            return; 
        }

        if(letter === '#'){
            await window.api.getNumberClients().then((value) => {
                setClient(value);
            }) 
            return;
        }

        await window.api.clientSearch(letter).then((value) => {
            setClient(value);
        })

    }

    const navigateToClient =  (url, state) => {
        navigate(url, {state:state})
    }


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
                    placeholder='Search Client Name' 
                    className='w-full p-1 bg-emerald-800 text-white border-transparent focus:border-transparent focus:ring-0 outline-none'
                />
            </div>

            <div className='bg-zinc-200 p-2 py-5 capitalize flex space-x-2'>
                <p>total clients: { totalClients && totalClients.length} </p>
                <p>Filter: {filter === "All" ? "None": filter}</p>
            
            </div>

            <div className='w-full h-full bg-white overflow-y-auto '>
                <table className='table-auto md:table-fixed w-full text-sm md:text-base h-full max-h-10'> 
                    <thead className='bg-emerald-700 sticky top-0'>
                        <tr className='text-white [&>th]:font-normal [&>th]:p-2 '>
                            <th className='w-10/12 '>Client Names</th>
                            <th className='w-1/12'>Total Jobs</th>
                            <th className='w-1/12'>Active Jobs</th>
                        </tr>
                    </thead>
                    <tbody className='text-xs md:text-base text-center overflow-y-auto '>
                        {clientData && clientData.map((item) => {
                            let clientURL = `/clients/${item.client_name.replace(/\s+/g, '')}` 
                            return (
                                
                                <tr className='border-1 hover:bg-yellow-100 hover:cursor-pointer' onClick={()=> {navigateToClient(clientURL, item.client_name)}}>
                                    <td className='py-2 px-3 text-left'>
                                        <Link to={`/clients/${item.client_name.replace(/\s+/g, '')}`}  state={item.client_name}>{item.client_name}</Link> 
                                    </td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                </tr>
                            )
                        })}
                    </tbody>          
                </table>
            </div>

            <div className='bg-emerald-700 p-2 text-white space-x-2'>
                <ul className='flex w-full [&>li]:grow'>
                    {
                        alphabet.map((item) =>{
                            return (
                                <li >
                                    <button 
                                        className={`p-2 ${item === filter ? "underline text-bold": null }`}
                                        onClick={() => {selectFilter(item)}}
                                    >
                                        {item}
                                    </button>
                                    {item === filter && <span>({clientData.length})</span>}
                                </li>
                            )
                        })
                    }
                </ul>

                
            </div>

        </div>
    )
}

export default Clients