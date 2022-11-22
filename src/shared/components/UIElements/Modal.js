import Backdrop from './Backdrop'
import React from 'react'
import ReactDOM  from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import './Modal.css'

const ModalOverlay = props => {
    const content = (
        <div className={`z-50 fixed bg-white top-24 rounded-md shadow-xl ${props.className}`}>
            <header className={` w-full p-2 m-1 `}>
                    {props.header}
            </header>

            <form
                onSubmit={props.onSubmit ? props.onSubmit : (event => event.preventDefault())}
            >
                <div className={` ${props.contentClass}`}>
                    {props.children}
                </div>

                <footer className={` rounded-md ${props.footerClass}`}>
                    {props.footer}
                </footer>
            
            </form>

        </div>
    )

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = props => {
  return (
    <React.Fragment>

        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition 
            in={props.show} 
            mountOnEnter
            unmountOnExit 
            timeout={100}
            classNames={`z-50 fixed bg-white w-fit top-24 ${props.className}`}
        >
            <ModalOverlay {...props} /> 
        </CSSTransition>
    </React.Fragment>
  )
}

export default Modal