import React, {useEffect, useState} from 'react'

import Header from '../components/header/Header'
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
            className='bg-zinc-300 flex flex-col h-screen max-w-screen p-4 lg:w-screen mt-16 md:mt-0 md:ml-16 lg:ml-56'
        >     
            <div className='rounded-lg mb-2' >
                <Header /> 
            </div>

            <div className=' bg-white rounded-lg h-screen mt-2 overflow-auto ' >
                <MainTable />
            </div>


        </div>
  )
}

export default Dashboard