import React, {useState} from 'react'

import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';


const Filters = () => {

    const tests = [
        "Micro A", 
        "Metals", 
        "Basic Potency", 
        "Deluxe Potenxy", 
        "Toxins",
        "Pesticides",
        "Micro B",
        "Terpenes",
        "Solvents",
        "Other", 
        "Fungal ID",
        "Psilocybin"
    ]

    //const [filters, setFilters] = useState(true);
    const [showTest, setShowTest] = useState(false); 
    //const [showStatus, setShowStatus] = useState(false); 
    const [testFiltersOptions, setTestFiltersOptions] = useState(Array(12).fill(false))

    const handleTestFiltersOptions = (postion) => {
        const updatedTestsOptions = testFiltersOptions.map((item, index) => 
            index === postion ? !item : item 
        );

        setTestFiltersOptions(updatedTestsOptions)
        console.log(testFiltersOptions)
    }



    return (
        <React.Fragment> 
            <div className='bg-zinc-200 p-4 flex space-x-3'>
                <div className='flex space-x-2 px-1 justify-center items-center text-emerald-600'>
                    <FilterListIcon />
                </div>

                <button 
                    className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500 hover:border-emerald-600 border-1 border-zinc-500'
                    onClick={() => setShowTest(!showTest)}
                >
                    <p className=''>Tests</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                {showTest && 
                    <div className="absolute top-32 left-72 bg-neutral-100 w-fit h-fit z-10 p-2">
                        <ul>
                            {tests.map((test, index) => {
                                return (
                                    <li className='space-x-2 flex p-1'>
                                        <input 
                                            type='checkbox' 
                                            
                                            name={test}
                                            value={test}
                                            checked={testFiltersOptions[index]}
                                            onChange={() =>handleTestFiltersOptions(index)}
                                        />
                                        <p>{test}</p>
                                    
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>
                }

                <button className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Client</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                <button className='bg-zinc-300 px-2 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Status</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

                <button className='bg-zinc-300 px-2 p-1 rounded-md flex justify-center uppercase text-sm items-center space-x-2 text-zinc-500' >
                    <p className=''>Date Created</p>
                    <ArrowDropDownIcon  className=''/>
                </button>

            </div>

            {testFiltersOptions.includes(true) && 
                <div className='px-4 py-2 bg-zinc-200 flex space-x-2 border-t-1 border-zinc-400'>
                    <ul className='space-x-1 flex'>
                        <li className='font-medium'>Tests:</li>
                        {testFiltersOptions.map((test, index) => {

                            if(test === true){
                                return (
                                    <li >
                                        {tests[index]} , 
                                    </li>
                                )
                            }
                            return null 
                        })}
                    </ul>

                    {testFiltersOptions.includes(true) && 
                        <button className='flex space-x-1 text-emerald-600' onClick={() => setTestFiltersOptions(Array(12).fill(false))}>
                            <CloseIcon />
                            <p className='text-emerald-600'>Clear All</p>
                        </button>
                    }

                   
                
                </div>
            }
        </React.Fragment>
    )
}

export default Filters