import React from 'react'

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function DownloadButton(props) {
    return (
        <button className=' m-2 p-2 rounded-lg bg-white drop-shadow-sm hover:drop-shadow-lg '>
            <div className='flex w-40 justify-between'>
                <CloudDownloadIcon className=''/>
                <p className=''>
                    {props.text}
                </p>
            </div>

        </button>
    )
}

export default DownloadButton