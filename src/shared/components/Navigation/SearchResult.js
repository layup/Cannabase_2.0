import React from 'react'
import { Link } from 'react-router-dom'


const SearchResults = ({results,clear}) => {

    //const location = useLocation()
    //console.log(location.pathname)


    return (
        
        <ul 
        className='absolute top-32 lg:top-16 w-10/12  h-64 overflow-y-scroll overflow-x-hidden bg-white drop-shadow-md z-10 hover:cursor-pointer'
        >
            <p className='sticky top-0 bg-white text-xs p-2'>Job Numver
            
            </p>
            {results.map((job) => {
                return (
                    <Link to={`/jobs/${job.job_number}`} onClick={clear}>
                        
                        <li 
                            key={job.job_number} 
                            className="curosr-pointer p-2 m-2 flex space-x-5 text-sm  hover:bg-green-200 transition duration-300`" 
                            
                            //onClick={() => 
                            //    setCurrentJob(job.job_number)
                            //}
                        >
                            <span>{job.job_number}</span>
                            <span>{job.client_name}</span> 
                        
                        </li>                    
                    </Link>
                )
            })}
        </ul>

    )
}

export default SearchResults