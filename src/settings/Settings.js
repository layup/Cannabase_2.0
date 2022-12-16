import React, { useEffect, useState } from 'react'

import Filepath from './Filepath'

const Settings = () => {

    const [databasePath, setDatabasePath] = useState()
    const [reportsPath, setReportsPath] = useState() 
    const [txtPath, setTxtPath] = useState(); 
    const [templatesPath, setTemplatesPath] = useState(); 

    //change so can be reused 
    const selectDatabasePath = async (callpack) => {
        await window.api.openFile().then((value) => {
            //setDatabasePath(value)
        })   
    }
    const setFilePath = async (filePath) => {
        await window.api.setFilePath(filePath).then((value) => {
            setReportsPath(value)
        })
    }
    const selectTxtPath = async (filePath) => {
        await window.api.setFilePath(filePath).then((value) => {
            setTxtPath(value)
        })
    }

    const selectTemplatePath = async (filePath) => {
        await window.api.setFilePath(filePath).then((value) => {
            setTemplatesPath(value)  
        })
    }
    //get all the paths from the start
    useEffect(() => {
        try {
            const results = window.api.getStorePathLocations()
            console.log(results)
            setDatabasePath(results.databaseLocation)
            setReportsPath(results.reportsPath)
            setTxtPath(results.txtPath)
            setTemplatesPath(results.templatesPath)
        } catch (error) {
            console.log(error)
        }
        
       
        //console.log(results)
        //setDatabasePath(results.databaseLocation)
        //setReportsPath(results.reportsPath)
        //setTxtPath(results.txtPath)


    }, [])


    return (
        <div
            className=' flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >
            <div className='flex flex-col space-y-2 p-2 w-full just'>

                <h2>File Path Location</h2>

                
                <Filepath 
                    title="SQL Database Path (U Drive)"
                    setPath={selectDatabasePath}
                    path={'databaseLocation'}
                    currentPath={databasePath}
                />
 
                <Filepath 
                    title="Images Path (X Drive)"
                    setPath={selectDatabasePath}
                    path="imagePath"
                    currentPath={'test'}
                />     

                <Filepath 
                    title="Reports (X Drive) "
                    setPath={setFilePath}
                    path={'reportsPath'}
                    currentPath={reportsPath}
                />     


                <Filepath 
                    title="Good Copies Report Path (U drive)"
                    setPath={selectDatabasePath}
                    currentPath={'test'}
                />     
                <Filepath 
                    title="TXT File Path (U Drive) "
                    setPath={selectTxtPath}
                    path="txtPath"
                    currentPath={txtPath}
                />     
                <Filepath 
                    title="Templates File Path (U Drive) "
                    setPath={selectTemplatePath}
                    path="templatesPath"
                    currentPath={templatesPath}
                />     
 
                
                <div className='space-x-2'>
                    <button className='bg-gray-200 p-2 rounded-md'>Dismiss All Changes</button>
                    <button className='bg-emerald-200 p-2 rounded-md'>Save All Changes</button>
                </div>


                <div className='text-center'>
                    <hr /> 
                    <h2>About</h2>
                    <h2>Help</h2>
                    <p><a href="https://github.com/layup/Cannabase_2.0" className='text-blue-400'>Creator: Tommy Lay</a></p>

                </div>

            </div>
            


        </div>
    )
}

export default Settings