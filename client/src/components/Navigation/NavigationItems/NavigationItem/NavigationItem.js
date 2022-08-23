import React from 'react'
import { NavLink } from 'react-router-dom'

import './NavigationItem.css'

const navigationItem = props => (
    <NavLink 
        to={props.link} 
        className={({ isActive }) => 
            'navigationItem' + (isActive ? ' navigationItem--active' : '')
        }
    >
        {props.children}
    </NavLink>
)

export default navigationItem