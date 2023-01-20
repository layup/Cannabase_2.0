import React, { useEffect, useState } from 'react'

import Filepath from './Filepath'

const Settings = () => {

    const [databasePath, setDatabasePath] = useState()
    const [reportsPath, setReportsPath] = useState() 
    const [txtPath, setTxtPath] = useState(); 
    const [templatesPath, setTemplatesPath] = useState(); 
    const [goodReportsPath, setGoodReportsPath] = useState();  
    const [imagePath, setImgePath] = useState(); 

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


    //get all the paths from the start
    useEffect(() => {
        try {
            const results = window.api.getStorePathLocations()
            console.log(results)
            setDatabasePath(results.databaseLocation)
            setReportsPath(results.reportsPath)
            setTxtPath(results.txtPath)
            setTemplatesPath(results.templatesPath)
            setGoodReportsPath(results.goodReportsPath)
            setImgePath(results.imagePath)
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
            <div className='flex flex-col space-y-2 p-2 w-full '>

                <h2 className='px-1'>File Path Location</h2>

                
                <Filepath 
                    title="SQL Database Path"
                    description="Where the .db SQL database is located"
                    setPath={selectDatabasePath}
                    path={'databaseLocation'}
                    currentPath={databasePath}
                />
            
 
                <Filepath 
                    title="Images Folder Path"
                    setPath={setFilePath}
                    path="imagePath"
                    currentPath={imagePath}
                />     

                <Filepath 
                    title="Reports Folder Path"
                    setPath={setFilePath}
                    path={'reportsPath'}
                    currentPath={reportsPath}
                />     


                <Filepath 
                    title="Good Copies Folder Path"
                    setPath={setFilePath}
                    path={'goodReportsPath'}
                    currentPath={goodReportsPath}
                />     
                <Filepath 
                    title="TXT File Folder Path  "
                    setPath={setFilePath}
                    path="txtPath"
                    currentPath={txtPath}
                />     
                <Filepath 
                    title="Templates File Folder Path"
                    setPath={setFilePath}
                    path="templatesPath"
                    currentPath={templatesPath}
                />     
 
                {/*
                <div className='space-x-2'>
                    <button className='bg-gray-200 p-2 rounded-md'>Dismiss All Changes</button>
                    <button className='bg-emerald-200 p-2 rounded-md'>Save All Changes</button>
                </div>
                */} 

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