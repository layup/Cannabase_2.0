import React from 'react'

import {Link, useLocation, matchPath } from 'react-router-dom'

const SidebarLink = (props) => {

    let location = useLocation(); 
    let match = matchPath(props.subLocation, location.pathname)

    return (
        <Link 
            className={`flex p-4  ${location.pathname === props.location || match  ?"bg-gray-200 text-emerald-600 md:border-r-4 border-emerald-600" : "text-zinc-600" }`} 
            to={props.location}
        >
            {props.icon}
            <p className='px-3 hidden lg:block'>{props.name}</p>
        </Link>
    )
}

export default SidebarLink