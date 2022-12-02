import React from 'react'

const ActionButton = (props) => {
  return (
    <button 
        className={`p-1 px-2 w-32  rounded-md border-1 border-zinc-500 text-black bg-white uppercase text-sm hover:text-white ${props.className}`}
        onClick={props.onClick}
    >
        {props.content}
    </button>
  )
}

export default ActionButton