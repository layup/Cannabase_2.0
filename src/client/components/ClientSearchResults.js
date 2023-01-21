import React from 'react'
import { Link } from 'react-router-dom'

const ClientSearchResults = ({results,clear}) => {

    return (
        
        <ul 
            className='absolute top-32 lg:top-16 w-10/12  h-64 overflow-y-scroll overflow-x-hidden bg-white drop-shadow-md z-20 hover:cursor-pointer'
        >
            <p className='sticky top-0 bg-white text-xs p-2'>Client Name 
            
            </p>
            {results.map((result) => {
                
                console.log('result: ', result)
                return (
                    
                    <Link to={`/clients/${result.client_name.replace(/\s+/g, '')}`}   state={result.client_name} onClick={clear}>

                    
                        <li 
                            key={result.client_name} 
                            className="curosr-pointer p-2 m-2 flex space-x-5 text-sm  hover:bg-green-200 transition duration-300`" 
                            
                        >
                            <span>{result.client_name}</span>
                        
                        </li>                    
                    </Link>
                    
                 
                )
            })}
        </ul>

    )
}

export default ClientSearchResults