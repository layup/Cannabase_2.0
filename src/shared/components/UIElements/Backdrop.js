import React from 'react'; 
import ReactDOM from 'react-dom'

const Backdrop = props => {
    return ReactDOM.createPortal(
        <div
            className='fixed top-0 bottom-0 left-0 w-full h-screen z-10 bg-black bg-opacity-75'
            onClick={props.onClick}
        />,  
        document.getElementById('backdrop-hook')
    )
}

export default Backdrop;