import React from 'react'
import { Link } from 'react-router-dom'

import './Button.css'

const button = props => (
    !props.link ? (
        <button
            className={
                props.class.split('-')[0] === 'auth' ?
                props.class.split('-')[1] === 'login' ? 'auth auth-login' : 'auth auth-signup' :
                props.class === 'nav-login' ? 'nav-login' : 'nav-signup'
            } 
            onClick={props.onClick}
            type={props.type}
            disabled={props.loading}
        >
            {props.children}
        </button>
    ) : (
        <Link 
            className={
                props.class === 'nav-login' ? 'nav-login' : 'nav-signup'
            } 
            to={props.link}
        >
            {props.children}
        </Link>
    )
)

export default button 