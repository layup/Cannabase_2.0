import React, {useEffect, useState} from 'react'
import Search from '../../shared/components/Navigation/Search'

import MainTable from '../components/table/MainTable'



const sendMessage = () => {
    let customMessage = "Hello World "
    window.api.sendMessage(customMessage)
    customMessage = ""
}

const tester =  async () => {    
    //let message = await window.api.getNoComplete
    let test =  window.api.test(); 
    console.log(await test);
}

const openFile = async (callpack) => {
    let path = await window.api.openFile()
    console.log(path)
    callpack(path)
}

const loadingTest = async () => {
    
    let querry = []

    let temp = await window.api.getNotComplete().then((value) => {
        querry.push(value)
    }); 
    console.log('attemping to print')
    console.log(querry)
}
function Dashboard() {

    //const [filePath, setFilePath] = useState()

    return (
        <div 
            className=' flex flex-col h-screen max-w-screen lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            
            <Search /> 
            <div className='p-4 bg-zinc-200'>
                <p>Active Jobs: {}</p>
            </div>

            <div className=' bg-white h-screen overflow-auto ' >
                <MainTable />
            </div>


        </div>
  )
}

export default Dashboard