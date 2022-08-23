import React from 'react'

import './Input.css'

const input = props => {
    let flag = false
    if (props.type === 'text' || props.type === 'password') {
        flag = true
    }

    return (
        <div className='input_container'>
            <label 
                className='input_label' 
                htmlFor={props.name}
            >
                {props.label}
            </label>
            {
                flag ?
                    <input
                        id={props.name}
                        className='input_text'
                        name={props.name} 
                        placeholder={props.placeholder} 
                        type={props.type}
                        onChange={props.onChange} 
                        value={props.value}
                    /> : 
                    <input
                        id={props.name}
                        className='input_text input_file' 
                        name={props.name}
                        type={props.type}
                        onChange={e => props.onChange(props.name, e.target.value, e.target.files)}
                    />
            }
        </div>
    )
}

export default input 