import React, { useState } from 'react'

import SearchIcon from '@mui/icons-material/Search';
import SearchResults from '../../shared/components/Navigation/SearchResult';
import ClientSearchResults from './ClientSearchResults';

const ClientSearch = () => {
    const [input, setInput] = useState("")
    const [bestMatches, setBestMatches] = useState([])

    const clear = () => {
        setInput("")
        setBestMatches([])
        
    }

    
    const updateBestMaches = async () => {       
        try {
            if(input) {
                const searchResults = await window.api.clientSearch(input)
                setBestMatches(searchResults)
                console.log(searchResults)
                //console.log(input);
                //console.log(bestMatches)

            }
        } catch (error) {
            setBestMatches([])
            console.log(error) 
       }
    }
    

    return (
        <div className='bg-emerald-700 p-4 flex w-full'>
            <div className='p-2 bg-emerald-800 hover:cursor-pointer' onClick={updateBestMaches}>
                <SearchIcon className='text-white bg-emerald-800'/>
            </div>

            <input 
                type='text' 
                value={input}
                placeholder='Search Client Name' 
                className='w-full p-1 bg-emerald-800 text-white border-transparent focus:border-transparent focus:ring-0 outline-none'
                onChange={(event) => {
                    setInput(event.target.value)
                }}
                onKeyUp={(event) => {
                    updateBestMaches(); 
                    
                }}
            />

            
            {(input && bestMatches.length > 0) ? 
                (
                    <ClientSearchResults results={bestMatches} clear={clear} />
                ):  null
            }
    </div>
    )

}

export default ClientSearch